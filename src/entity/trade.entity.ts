import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum TradeAction {
  BUY = 'buy',
  SELL = 'sell',
}

@Entity()
@Index(['app', 'tradeId'], { unique: true })
export class Trade {
  @PrimaryGeneratedColumn({ comment: 'Unique ID of the trade' })
  id: number;

  @Column({ comment: 'The app of the trade' })
  @Index()
  app: string;

  @Index()
  @Column({
    type: 'enum',
    comment: 'Action of the trade',
    enum: TradeAction,
  })
  action: TradeAction;

  @Column({ comment: 'Trade symbol' })
  @Index()
  symbol: string;

  @Column({ type: 'double', comment: 'The traded price of the asset' })
  price: number;

  @Column({ comment: 'The traded price currency' })
  priceCurrency: string;

  @Column({ type: 'double', comment: 'The amount of asset being traded' })
  quantity: number;

  @Column({ type: 'double', default: 0, comment: 'The fee spent on the trade' })
  fee: number;

  @Column({ comment: 'The fee spent currency' })
  feeCurrency: string;

  @Column({ comment: 'The date time of the trade being executed' })
  @Index()
  date: Date;

  @Column({ nullable: true, comment: 'Note of the trade' })
  note: string;

  @Column({ comment: 'Unique trade ID assigned by the app' })
  @Index()
  tradeId: string;
}
