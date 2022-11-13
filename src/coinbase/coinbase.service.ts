import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as ccxt from 'ccxt';
import * as moment from 'moment';
import { Trade, TradeAction } from 'src/trade/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoinbaseService {
  @Inject(ConfigService)
  public config: ConfigService;
  public coinbaseExchange: ccxt.coinbase;

  private appName = 'coinbase';
  private PAGINATION_LIMIT = 300;

  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    config: ConfigService,
  ) {
    const coinbaseApiKey: string = config.get('COINBASE_API_KEY');
    const coinbaseSecret: string = config.get('COINBASE_API_SECRET');
    this.coinbaseExchange = new ccxt.coinbase({
      apiKey: coinbaseApiKey,
      secret: coinbaseSecret,
    });
  }

  /**
   * Get the balance in coinbase
   * @returns A map of coinbase balance
   */
  async getBalance(): Promise<any> {
    const balance = {};
    const totalBalance = await this.coinbaseExchange.fetchTotalBalance({
      limit: this.PAGINATION_LIMIT,
    });
    for (const symbol in totalBalance) {
      if (Object.prototype.hasOwnProperty.call(totalBalance, symbol)) {
        const amount = totalBalance[symbol];
        if (amount > 0) {
          balance[symbol] = amount;
        }
      }
    }
    return balance;
  }

  /**
   * Get all trades in Coinbase of a desired list and save to DB.
   *
   * Update every hour.
   * @returns A list of saved trades
   */
  @Cron('0 0 * * * *')
  async getAllTrades(): Promise<any> {
    const symbols = [
      'SOL',
      'GAL',
      'ETH',
      'MLN',
      'SAND',
      'RNDR',
      'SKL',
      'FET',
      'GRT',
      'AMP',
      'XCN',
    ];
    const symbolSet = new Set<string>();
    symbols.forEach((symbol) => symbolSet.add(symbol));
    let accounts: Array<any> = await this.coinbaseExchange.fetchAccounts({
      limit: this.PAGINATION_LIMIT,
    });
    accounts = accounts.filter((account) => symbolSet.has(account.code));
    let allTrades = [];
    await Promise.all(
      accounts.map(async (account) => {
        const trades = await this.getTrades(account.id, account.code);
        allTrades = allTrades.concat(trades);
      }),
    );
    const allSavedTrades = await this.saveTrades(allTrades);
    return allSavedTrades;
  }

  /**
   * Get a list of trade history of the given asset in Coinbase
   * @param accountId Account ID in Coinbase
   * @param symbol Asset symbol
   * @returns A list of trade history of the asset
   */
  private async getTrades(accountId: string, symbol: string): Promise<any> {
    let allTrades = [];
    const ledgers = await this.coinbaseExchange.fetchLedger(
      symbol,
      null,
      this.PAGINATION_LIMIT,
      {
        account_id: accountId,
      },
    );
    // ! Since I don't have buy and sell records, and I am not sure if ledgers include the information of buys and sells. Therefore, I choose to not implement it at this moment.
    // const buys = await this.coinbaseExchange.fetchMyBuys(
    //   null,
    //   null,
    //   this.PAGINATION_LIMIT,
    //   {
    //     account_id: accountId,
    //   },
    // );
    // const sells = await this.coinbaseExchange.fetchMySells(
    //   null,
    //   null,
    //   this.PAGINATION_LIMIT,
    //   {
    //     account_id: accountId,
    //   },
    // );
    // const buyAndSell = buys + sells;
    const trades = ledgers.map((ledger) => {
      const trade = new Trade();
      trade.app = this.appName;
      trade.action =
        ledger.direction === 'in' ? TradeAction.BUY : TradeAction.SELL;
      trade.symbol = ledger.currency;
      trade.quantity = ledger.amount;
      trade.date = moment(ledger.datetime).toDate();
      trade.fee = 0;
      trade.fee_currency = ledger.info.native_amount.currency;
      trade.price =
        ledger.info.description === 'Earn Task'
          ? 0
          : Math.abs(
              parseFloat(ledger.info.native_amount.amount) / ledger.amount,
            );
      trade.price_currency = ledger.info.native_amount.currency;
      trade.trade_id = ledger.id;
      return trade;
    });
    allTrades = allTrades.concat(trades);
    return allTrades;
  }

  /**
   * Save a trade history to the database.
   * @param trades Trade history
   */
  private async saveTrades(trades: Trade[]) {
    const savedTrades = [];
    for (const trade of trades) {
      const savedTradeEntity = await this.tradesRepository.save(trade);
      savedTrades.push(savedTradeEntity);
    }
    return savedTrades;
  }
}
