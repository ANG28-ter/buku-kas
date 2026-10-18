export type TransactionType = "income" | "expense";

export type Settings = {
  initial_balance: number;
  onboarding_done: 0 | 1;
  theme: 'light' | 'dark';
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category_id: string;
  note: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
  balance_before: number;
  balance_after: number;
  is_deleted: 0 | 1;
  deleted_at: string | null;
};

export type Period = {
  id: string;
  type: 'weekly' | 'monthly' | 'custom';
  name: string;
  start_date: string;
  end_date: string | null;
  starting_balance: number;
  ending_balance: number | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};
