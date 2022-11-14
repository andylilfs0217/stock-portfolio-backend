import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CdcService {
  private appName = 'cdc';

  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
