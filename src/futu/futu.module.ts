import { FutuService } from './futu.service';
import { FutuController } from './futu.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [FutuController],
  providers: [FutuService],
})
export class FutuModule {}
