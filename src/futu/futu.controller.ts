import { Controller, Get } from '@nestjs/common';
import { FutuService } from './futu.service';

@Controller('futu')
export class FutuController {
  constructor(private readonly futuService: FutuService) {}

  @Get('account')
  async getAccount(): Promise<any> {
    const res = await this.futuService.getAccount();
    return res;
  }
}
