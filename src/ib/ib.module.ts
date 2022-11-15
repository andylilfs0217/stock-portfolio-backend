import { IbService } from './ib.service';
import { IbController } from './ib.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade]),
    MulterModule.register({
      dest: './upload/ib',
    }),
  ],
  controllers: [IbController],
  providers: [IbService],
})
export class IbModule {}
