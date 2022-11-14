import { IbService } from './ib.service';
import { IbController } from './ib.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [IbController],
  providers: [IbService],
})
export class IbModule {}
