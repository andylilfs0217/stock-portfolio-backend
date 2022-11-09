import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  app: string;

  @Column()
  action: string;

  @Column()
  symbol: string;

  @Column({ type: 'double' })
  price: number;

  @Column()
  price_currency: string;

  @Column({ type: 'double' })
  quantity: number;

  @Column({ type: 'double', default: 0 })
  fee: number;

  @Column()
  fee_currency: string;

  @Column()
  date: Date;

  @Column({ nullable: true })
  note: string;
}
