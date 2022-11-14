import { IbModule } from './ib/ib.module';
import { IbService } from './ib/ib.service';
import { CoinbaseModule } from './coinbase/coinbase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BinanceModule } from './binance/binance.module';
import { getEnvPath } from './common/helper/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    // * * * * * *
    // | | | | | |
    // | | | | | day of week
    // | | | | months
    // | | | day of month
    // | | hours
    // | minutes
    // seconds (optional)
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 13306,
      username: 'andy',
      password: 'Andyli!!!0217',
      database: 'stock_tracker',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    BinanceModule,
    CoinbaseModule,
    IbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
