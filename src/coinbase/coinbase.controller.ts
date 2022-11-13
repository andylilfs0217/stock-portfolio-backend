import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoinbaseService } from './coinbase.service';

@Controller('coinbase')
export class CoinbaseController {
  constructor(private readonly coinbaseService: CoinbaseService) {}

  @Get('balance')
  async getBalance(): Promise<any> {
    const res = await this.coinbaseService.getBalance();
    return res;
  }

  @Get('trades')
  async getAllTrades(): Promise<any> {
    const res = await this.coinbaseService.getAllTrades();
    return res;
  }
}
