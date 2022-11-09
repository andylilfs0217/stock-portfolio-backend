import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';

@Injectable()
export class BinanceService {
  @Inject(ConfigService)
  public config: ConfigService;

  async getSpotAndFlexBalance(): Promise<any> {
    const binanceApiKey: string = this.config.get('BINANCE_API_KEY');
    const binanceSecret: string = this.config.get('BINANCE_API_SECRET');
    const binanceExchange = new ccxt.binance({
      apiKey: binanceApiKey,
      secret: binanceSecret,
    });
    const balances = {};
    const totalBalance = await binanceExchange.fetchTotalBalance();
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
}
