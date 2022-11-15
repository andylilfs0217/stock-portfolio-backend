import { CdcService } from './cdc.service';
import { CdcController } from './cdc.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { CdcRecord } from 'src/entity/cdc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, CdcRecord])],
  controllers: [CdcController],
  providers: [CdcService],
})
export class CdcModule {}
