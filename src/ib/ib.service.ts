import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IbService {
  private appName = 'ib';

  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
  ) {}

  async getBalance(): Promise<any> {
    return;
  }

  async getTrades(): Promise<any> {
    return;
  }
}
