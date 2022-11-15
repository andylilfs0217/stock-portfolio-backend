import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CdcService } from './cdc.service';

@Controller('cdc')
export class CdcController {
  constructor(private readonly cdcService: CdcService) {}

  @Post('upload-transactions')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTransactions(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const res = await this.cdcService.uploadTransactions(file);
    return res;
  }

  @Get('balance')
  async getBalance(): Promise<any> {
    const res = await this.cdcService.getBalance();
    return res;
  }
}
