import { Controller } from '@nestjs/common';
import { CdcService } from './cdc.service';

@Controller()
export class CdcController {
  constructor(private readonly cdcService: CdcService) {}
}
