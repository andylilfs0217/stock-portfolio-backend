import { CoinbaseController } from './coinbase.controller';
import { CoinbaseService } from './coinbase.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/trade/trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [CoinbaseController],
  providers: [CoinbaseService],
})
export class CoinbaseModule {}
