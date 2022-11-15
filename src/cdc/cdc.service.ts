import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { CdcRecord, CdcTransactionKind } from 'src/entity/cdc.entity';
import * as hash from 'object-hash';

@Injectable()
export class CdcService {
  private appName = 'cdc';
  private csvHeader = [
    'timestamp',
    'description',
    'currency',
    'amount',
    'toCurrency',
    'toAmount',
    'nativeCurrency',
    'nativeAmount',
    'nativeAmountInUsd',
    'transactionKind',
    'transactionHash',
  ];

  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    @InjectRepository(CdcRecord)
    private cdcRecordsRepository: Repository<CdcRecord>,
  ) {}

  async uploadTransactions(file: Express.Multer.File): Promise<any> {
    let records = this.readCdcRecordsFromCsv(file);
    records = records.map((record) => {
      record.id = this.getIdFromCdcRecord(record);
      return record;
    });
    const result = await this.cdcRecordsRepository.upsert(records, ['id']);
    return records;
  }

  async getBalance(): Promise<any> {
    const revertAmountKinds = [CdcTransactionKind.RECURRING_BUY_ORDER];
    let balances = new Map<string, number>();
    const records = await this.cdcRecordsRepository.find();
    for (const record of records) {
      let amount = record.amount;
      if (revertAmountKinds.indexOf(record.transactionKind) !== -1) {
        amount *= -1;
      }
      let balance = (balances.get(record.currency) || 0) + amount;
      balances = balances.set(record.currency, balance);

      if (record.toCurrency !== null) {
        amount = record.toAmount;
        balance = (balances.get(record.toCurrency) || 0) + amount;
        balances = balances.set(record.toCurrency, balance);
      }
    }
    for (const [symbol, balance] of balances) {
      const roundedBalance = Number(balance.toFixed(10));
      if (roundedBalance === 0) {
        balances.delete(symbol);
      } else {
        balances = balances.set(symbol, roundedBalance);
      }
    }
    return Object.fromEntries(balances);
  }

  private readCdcRecordsFromCsv(file: Express.Multer.File): CdcRecord[] {
    const csvString = file.buffer.toString();
    const records = parse(csvString, {
      columns: this.csvHeader,
      skip_empty_lines: true,
      from_line: 2,
    }).map((record: CdcRecord) => CdcRecord.fromJSON(record));
    return records;
  }

  private getIdFromCdcRecord(cdcRecord: CdcRecord): string {
    const id = hash(cdcRecord);
    return id;
  }
}
