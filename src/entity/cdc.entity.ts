import * as moment from 'moment';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

export enum CdcTransactionKind {
  CARD_CASHBACK_REVERTED = 'card_cashback_reverted',
  CARD_TOP_UP = 'card_top_up',
  CRYPTO_DEPOSIT = 'crypto_deposit',
  CRYPTO_EXCHANGE = 'crypto_exchange',
  CRYPTO_PURCHASE = 'crypto_purchase',
  CRYPTO_WALLET_SWAP_CREDITED = 'crypto_wallet_swap_credited',
  CRYPTO_WALLET_SWAP_DEBITED = 'crypto_wallet_swap_debited',
  CRYPTO_WITHDRAWAL = 'crypto_withdrawal',
  DUST_CONVERSION_CREDITED = 'dust_conversion_credited',
  DUST_CONVERSION_DEBITED = 'dust_conversion_debited',
  LOCKUP_LOCK = 'lockup_lock',
  LOCKUP_UNLOCK = 'lockup_unlock',
  LOCKUP_UPGRADE = 'lockup_upgrade',
  MCO_STAKE_REWARD = 'mco_stake_reward',
  RECURRING_BUY_ORDER = 'recurring_buy_order',
  REFERRAL_CARD_CASHBACK = 'referral_card_cashback',
  REIMBURSEMENT = 'reimbursement',
  REIMBURSEMENT_REVERTED = 'reimbursement_reverted',
  REWARDS_PLATFORM_DEPOSIT_CREDITED = 'rewards_platform_deposit_credited',
  FUND_LOCK = 'trading.limit_order.crypto_wallet.fund_lock',
  FUND_UNLOCK = 'trading.limit_order.crypto_wallet.fund_unlock',
}

@Entity()
export class CdcRecord {
  @PrimaryColumn({ comment: 'id', type: 'varchar' })
  public id: string;

  @Column({ comment: '' })
  public timestamp: Date;

  @Column({ comment: '' })
  public description: string;

  @Column({ comment: '' })
  @Index()
  public currency: string;

  @Column({ comment: '', type: 'double' })
  public amount: number;

  @Column({ comment: '', nullable: true })
  @Index()
  public toCurrency?: string;

  @Column({ comment: '', type: 'double', nullable: true })
  public toAmount?: number;

  @Column({ comment: '' })
  public nativeCurrency: string;

  @Column({ comment: '', type: 'double' })
  public nativeAmount: number;

  @Column({ comment: '', type: 'double' })
  public nativeAmountInUsd: number;

  @Column({ comment: '', type: 'enum', enum: CdcTransactionKind })
  @Index()
  public transactionKind: CdcTransactionKind;

  @Column({ comment: '', nullable: true })
  public transactionHash?: string;

  public static fromJSON = (json: any): CdcRecord => {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    const obj = new CdcRecord();
    obj.timestamp = moment.utc(json.timestamp).toDate();
    obj.description = json.description;
    obj.currency = json.currency;
    obj.amount = Number(json.amount);
    obj.toCurrency =
      json.toCurrency !== null && json.toCurrency.length > 0
        ? json.toCurrency
        : null;
    obj.toAmount =
      json.toAmount !== null && json.toAmount.length > 0
        ? Number(json.toAmount)
        : null;
    obj.nativeCurrency = json.nativeCurrency;
    obj.nativeAmount =
      json.nativeAmount !== null && json.nativeAmount.length > 0
        ? Number(json.nativeAmount)
        : null;
    obj.nativeAmountInUsd =
      json.nativeAmountInUsd !== null && json.nativeAmountInUsd.length > 0
        ? Number(json.nativeAmountInUsd)
        : null;
    obj.transactionKind = json.transactionKind as CdcTransactionKind;
    obj.transactionHash =
      json.transactionHash !== null && json.transactionHash.length > 0
        ? json.transactionHash
        : null;
    return obj;
  };
}
