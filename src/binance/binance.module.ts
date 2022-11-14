import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [BinanceController],
  providers: [BinanceService],
})
export class BinanceModule {}
