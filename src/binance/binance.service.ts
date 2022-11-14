import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as ccxt from 'ccxt';
import * as moment from 'moment';
import { Trade, TradeAction } from 'src/entity/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BinanceService {
  @Inject(ConfigService)
  public config: ConfigService;
  public binanceExchange: ccxt.binance;

  private appName = 'binance';

  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    config: ConfigService,
  ) {
    const binanceApiKey: string = config.get('BINANCE_API_KEY');
    const binanceSecret: string = config.get('BINANCE_API_SECRET');
    this.binanceExchange = new ccxt.binance({
      apiKey: binanceApiKey,
      secret: binanceSecret,
    });
  }

  /**
   * Get all current spot and flexible staking balance from Binance.
   * @returns A map of the current spot and flexible staking balance
   */
  async getSpotAndFlexBalance(): Promise<any> {
    const balances = {};
    const totalBalance = await this.binanceExchange.fetchTotalBalance();
    for (let asset in totalBalance) {
      if (Object.prototype.hasOwnProperty.call(totalBalance, asset)) {
        const balance = totalBalance[asset];
        if (balance > 0) {
          asset = asset.slice(0, 2) == 'LD' ? asset.slice(2) : asset;
          balances[asset] = (balances[asset] ?? 0) + balance;
        }
      }
    }
    return balances;
  }

  /**
   * Get all personal trade history in a given time range of a specific trade symbol.
   * @param symbol Trade symbol
   * @param since Since time in milliseconds
   * @param to Until time in milliseconds
   * @param limit Number of records for each request
   * @returns A list of my trade history
   */
  async getMyTradeHistory(
    symbol: string,
    since: number,
    to: number,
    limit: number,
  ): Promise<ccxt.Trade[]> {
    let history: ccxt.Trade[] = [];
    while (since < to) {
      const trades = await this.binanceExchange.fetchMyTrades(
        symbol,
        since,
        limit,
      );
      if (trades.length) {
        since = trades[trades.length - 1]['timestamp'] + 1;
        history = history.concat(trades);
      } else {
        break;
      }
    }
    this.saveTradeHistory(history);
    return history;
  }

  /**
   * Get all my trade history in previous 24 hours.
   *
   * Update every hour.
   * @returns A list of my trade history
   */
  @Cron('0 0 * * * *')
  private async updateMyTradeHistory() {
    const symbols = ['BETH/ETH'];
    const since = moment().add(1, 'days').valueOf();
    const to = moment().valueOf();
    const limit = 100;
    let allHistory: ccxt.Trade[] = [];
    await Promise.all(
      symbols.map(async (symbol) => {
        const history = await this.getMyTradeHistory(symbol, since, to, limit);
        allHistory = allHistory.concat(history);
      }),
    );
    const savedTradeHistory = await this.saveTradeHistory(allHistory);
    return savedTradeHistory;
  }

  /**
   * Save a trade history to the database.
   * @param history Trade history
   */
  private async saveTradeHistory(history: ccxt.Trade[]) {
    const savedTradeHistory = await Promise.all(
      history.map(async (trade) => {
        const tradeEntity = new Trade();
        tradeEntity.app = this.appName;
        tradeEntity.action = TradeAction[trade.side];
        tradeEntity.date = new Date(trade.datetime);
        tradeEntity.fee = trade.fee.cost;
        tradeEntity.feeCurrency = trade.fee.currency;
        tradeEntity.price = trade.price;
        tradeEntity.priceCurrency = trade.symbol.split('/')[1];
        tradeEntity.quantity = trade.amount;
        tradeEntity.symbol = trade.symbol;
        const savedTradeEntity = await this.tradesRepository.save(tradeEntity);
        return savedTradeEntity;
      }),
    );
    return savedTradeHistory;
  }
}
