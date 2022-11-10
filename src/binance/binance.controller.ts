import { Controller, Get, Query } from '@nestjs/common';
import { Trade } from 'ccxt';
import * as moment from 'moment';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('spot-and-flex')
  async getSpotAndFlexBalance(): Promise<any> {
    const res = await this.binanceService.getSpotAndFlexBalance();
    return res;
  }

  @Get('my-trade-history')
  async getMyTradeHistory(
    @Query('symbol') symbol: string,
    @Query('since') since: string,
    @Query('to') to: string,
    @Query('limit') limit: number,
  ): Promise<Trade[]> {
    const sinceMiliSec = moment(since).valueOf();
    const toMiliSec =
      to !== undefined ? moment(to).valueOf() : moment().valueOf();
    limit = limit || 100;
    const res = await this.binanceService.getMyTradeHistory(
      symbol,
      sinceMiliSec,
      toMiliSec,
      limit,
    );
    return res;
  }
}
