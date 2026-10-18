import { db } from "../db";
import type { Transaction } from "../models/domain";

export function getTransactionById(id: string): Transaction | null {
  const row = db.getFirstSync(
    `SELECT * FROM transactions WHERE id = '${escapeSql(id)}' LIMIT 1;`
  ) as any;
  return row ?? null;
}

export function listTransactionsByPeriodAsc(periodId: string): Transaction[] {
  const rows = db.getAllSync(
    `SELECT *
     FROM transactions
     WHERE is_deleted = 0 AND period_id = '${escapeSql(periodId)}'
     ORDER BY occurred_at ASC, id ASC;`
  ) as any[];
  return (rows ?? []) as Transaction[];
}

export function listTransactionsByPeriodDesc(periodId: string): Transaction[] {
  const rows = db.getAllSync(
    `SELECT *
     FROM transactions
     WHERE is_deleted = 0 AND period_id = '${escapeSql(periodId)}'
     ORDER BY occurred_at DESC, id DESC;`
  ) as any[];
  return (rows ?? []) as Transaction[];
}

export function listActiveTransactionsAsc(): Transaction[] {
  const rows = db.getAllSync(
    `SELECT *
     FROM transactions
     WHERE is_deleted = 0
     ORDER BY occurred_at ASC, id ASC;`
  ) as any[];
  return (rows ?? []) as Transaction[];
}

export function updateTransactionCoreFields(params: {
  id: string;
  type: "income" | "expense";
  amount: number;
  category_id: string;
  note: string | null;
  occurred_at: string;
}) {
  db.execSync(`
    UPDATE transactions
    SET
      type='${params.type}',
      amount=${params.amount},
      category_id='${escapeSql(params.category_id)}',
      note=${params.note === null ? "NULL" : `'${escapeSql(params.note)}'`},
      occurred_at='${params.occurred_at}',
      updated_at=datetime('now')
    WHERE id='${escapeSql(params.id)}';
  `);
}

export function updateTransactionBalances(
  id: string,
  balance_before: number,
  balance_after: number
) {
  db.execSync(`
    UPDATE transactions
    SET
      balance_before=${balance_before},
      balance_after=${balance_after},
      updated_at=datetime('now')
    WHERE id='${escapeSql(id)}';
  `);
}

export function softDeleteTransaction(id: string) {
  db.execSync(`
    UPDATE transactions
    SET
      is_deleted=1,
      deleted_at=datetime('now'),
      updated_at=datetime('now')
    WHERE id='${escapeSql(id)}';
  `);
}

export function insertTransaction(tx: Transaction, periodId: string) {
  db.execSync(`
    INSERT INTO transactions
    (id, type, amount, category_id, note, occurred_at, created_at, updated_at, balance_before, balance_after, is_deleted, deleted_at, period_id)
    VALUES
    (
      '${escapeSql(tx.id)}',
      '${tx.type}',
      ${tx.amount},
      '${escapeSql(tx.category_id)}',
      ${tx.note === null ? "NULL" : `'${escapeSql(tx.note)}'`},
      '${tx.occurred_at}',
      '${tx.created_at}',
      '${tx.updated_at}',
      ${tx.balance_before},
      ${tx.balance_after},
      ${tx.is_deleted},
      ${tx.deleted_at === null ? "NULL" : `'${tx.deleted_at}'`},
      '${escapeSql(periodId)}'
    );
  `);
}

function escapeSql(text: string) {
  return text.replace(/'/g, "''");
}
