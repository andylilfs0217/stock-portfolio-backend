import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';

@Module({
  imports: [
    // * * * * * *
    // | | | | | |
    // | | | | | day of week
    // | | | | months
    // | | | day of month
    // | | hours
    // | minutes
    // seconds (optional)
    ScheduleModule.forRoot(),
  ],
  controllers: [BinanceController],
  providers: [BinanceService],
})
export class BinanceModule {}
