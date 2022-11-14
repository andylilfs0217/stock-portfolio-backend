import { Controller, Get } from '@nestjs/common';
import { IbService } from './ib.service';

@Controller('ib')
export class IbController {
  constructor(private readonly ibService: IbService) {}

  @Get('balance')
  async getBalance(): Promise<any> {
    const res = await this.ibService.getBalance();
    return res;
  }

  @Get('trades')
  async getTrades(): Promise<any> {
    const res = await this.ibService.getTrades();
    return res;
  }
}
