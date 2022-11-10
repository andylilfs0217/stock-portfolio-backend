import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as ccxt from 'ccxt';
import { Trade } from 'src/trade/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoinbaseService {
  @Inject(ConfigService)
  public config: ConfigService;
  public coinbaseExchange: ccxt.binance;

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

  async getTrades(): Promise<any> {
    const allTrades = [];
    const accounts = await this.coinbaseExchange.fetchAccounts({
      limit: this.PAGINATION_LIMIT,
    });
    // const ledgers = await this.coinbaseExchange.fetchLedger({
    //   account_id: 'edac72c5-cf98-5979-a085-20de5fd3578c',
    // });
    const buys = await this.coinbaseExchange.fetchMyBuys({
      account_id: 'edac72c5-cf98-5979-a085-20de5fd3578c',
    });
    const sells = await this.coinbaseExchange.fetchMySells({
      account_id: 'edac72c5-cf98-5979-a085-20de5fd3578c',
    });
    return allTrades;
  }
}
