import type { TransactionType } from './domain';

export type AddTransactionInput = {
  type: TransactionType;
  amount: number;           // integer rupiah
  category_id: string;      // sementara default 'cat_misc'
  note?: string;
  occurred_at?: string;     // default now
};
