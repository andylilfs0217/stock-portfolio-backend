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

  async getBalance(): Promise<any> {
    const balance = await this.coinbaseExchange.fetchBalance();
    return balance;
  }
}
