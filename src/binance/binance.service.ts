import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BinanceService {
  @Inject(ConfigService)
  public config: ConfigService;

  getSpotBalance(): any {
    return { ahhah: this.config.get('BINANCE_API_KEY') };
  }
}
