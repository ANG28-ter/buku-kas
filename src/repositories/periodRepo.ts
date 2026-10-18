import { db } from "../db";
import type { Period } from "../models/domain";
import { v4 as uuidv4 } from "uuid";

export function createPeriod(
  type: 'weekly' | 'monthly' | 'custom',
  name: string,
  startingBalance: number,
  startDate?: string
): Period {
  const now = new Date().toISOString();
  const id = uuidv4();
  const start = startDate || now;

  db.execSync(`
    INSERT INTO periods (id, type, name, start_date, starting_balance, is_active, created_at, updated_at)
    VALUES ('${id}', '${type}', '${name}', '${start}', ${startingBalance}, 1, '${now}', '${now}');
  `);

  return {
    id,
    type,
    name,
    start_date: start,
    end_date: null,
    starting_balance: startingBalance,
    ending_balance: null,
    is_active: 1,
    created_at: now,
    updated_at: now,
  };
}

export function getActivePeriod(): Period | null {
  const row = db.getFirstSync(`
    SELECT * FROM periods WHERE is_active = 1 LIMIT 1;
  `) as any;

  if (!row) return null;

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    start_date: row.start_date,
    end_date: row.end_date,
    starting_balance: row.starting_balance,
    ending_balance: row.ending_balance,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function getAllPeriods(): Period[] {
  const rows = db.getAllSync(`
    SELECT * FROM periods ORDER BY start_date DESC;
  `) as any[];

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    start_date: row.start_date,
    end_date: row.end_date,
    starting_balance: row.starting_balance,
    ending_balance: row.ending_balance,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export function findPeriodByName(name: string): Period | null {
  const row = db.getFirstSync(`
    SELECT * FROM periods WHERE name = '${name}' LIMIT 1;
  `) as any;

  if (!row) return null;

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    start_date: row.start_date,
    end_date: row.end_date,
    starting_balance: row.starting_balance,
    ending_balance: row.ending_balance,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function closePeriod(periodId: string, endingBalance: number) {
  const now = new Date().toISOString();

  db.execSync(`
    UPDATE periods
    SET is_active = 0,
        end_date = '${now}',
        ending_balance = ${endingBalance},
        updated_at = '${now}'
    WHERE id = '${periodId}';
  `);
}

export function setActivePeriod(periodId: string) {
  const now = new Date().toISOString();

  // Deactivate all periods
  db.execSync(`
    UPDATE periods SET is_active = 0, updated_at = '${now}';
  `);

  // Activate selected period
  db.execSync(`
    UPDATE periods SET is_active = 1, updated_at = '${now}'
    WHERE id = '${periodId}';
  `);

  // Update settings
  db.execSync(`
    UPDATE settings SET active_period_id = '${periodId}', updated_at = '${now}'
    WHERE id = 1;
  `);
}

export function updatePeriodStartingBalance(periodId: string, newBalance: number) {
  const now = new Date().toISOString();

  db.execSync(`
    UPDATE periods
    SET starting_balance = ${newBalance},
        updated_at = '${now}'
    WHERE id = '${periodId}';
  `);
}

export function getPeriodTransactionCount(periodId: string): number {
  const result = db.getFirstSync(`
    SELECT COUNT(*) as count
    FROM transactions
    WHERE period_id = '${periodId}' AND is_deleted = 0;
  `) as any;

  return result?.count ?? 0;
}

export function deletePeriod(periodId: string) {
  db.execSync(`
    DELETE FROM periods WHERE id = '${periodId}';
  `);
}

export function deleteTransactionsByPeriodId(periodId: string) {
  db.execSync(`
    DELETE FROM transactions WHERE period_id = '${periodId}';
  `);
}
