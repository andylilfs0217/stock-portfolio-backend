import { Controller, Get } from '@nestjs/common';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('spot-and-flex')
  async getSpotAndFlexBalance(): Promise<any> {
    const res = await this.binanceService.getSpotAndFlexBalance();
    return res;
  }

  @Get('history')
  async getHistory(): Promise<any> {
    const res = await this.binanceService.getHistory();
    return res;
  }
}
