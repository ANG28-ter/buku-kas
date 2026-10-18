import { db } from "./index";

export function runMigrations() {
  db.execSync(`PRAGMA foreign_keys = ON;`);

  // SETTINGS
  db.execSync(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      initial_balance INTEGER NOT NULL DEFAULT 0,
      onboarding_done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Pastikan kolom onboarding_done ada untuk DB lama (ALTER aman pakai try/catch)
  try {
    db.execSync(
      `ALTER TABLE settings ADD COLUMN onboarding_done INTEGER NOT NULL DEFAULT 0;`
    );
  } catch {
    // ignore kalau kolom sudah ada
  }

  // Pastikan kolom theme ada
  try {
    db.execSync(
      `ALTER TABLE settings ADD COLUMN theme TEXT NOT NULL DEFAULT 'light';`
    );
  } catch {
    // ignore kalau kolom sudah ada
  }

  db.execSync(`
    INSERT OR IGNORE INTO settings (id, initial_balance, onboarding_done, theme, created_at, updated_at)
    VALUES (1, 0, 0, 'light', datetime('now'), datetime('now'));
  `);

  // TRANSACTIONS
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('income','expense')),
      amount INTEGER NOT NULL CHECK (amount > 0),
      category_id TEXT NOT NULL,
      note TEXT,
      occurred_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      balance_before INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT
    );
  `);

  // Kalau kamu sebelumnya bikin tabel transactions versi test yang belum punya kolom-kolom ini,
  // lebih aman untuk dev: hapus app dari HP/clear data atau ganti nama DB sementara.
  // (Untuk sekarang kita anggap kamu lanjut dari schema yang baru ini.)

  db.execSync(`
    CREATE INDEX IF NOT EXISTS idx_transactions_active_recent
    ON transactions (is_deleted, occurred_at DESC);
  `);

  // CATEGORIES
  db.execSync(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income','expense','both')) DEFAULT 'both',
    name TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

  db.execSync(`
  CREATE INDEX IF NOT EXISTS idx_categories_active_sort
  ON categories (is_active, sort_order);
`);

  // Seed default categories (id tetap, biar konsisten)
  db.execSync(`
  INSERT OR IGNORE INTO categories (id, type, name, icon, sort_order, is_active, created_at, updated_at) VALUES
  ('cat_exp_food',      'expense', 'Makan',      '🍜', 10, 1, datetime('now'), datetime('now')),
  ('cat_exp_transport', 'expense', 'Transport',  '🚕', 20, 1, datetime('now'), datetime('now')),
  ('cat_exp_shopping',  'expense', 'Belanja',    '🛍️', 30, 1, datetime('now'), datetime('now')),
  ('cat_exp_bill',      'expense', 'Tagihan',    '🧾', 40, 1, datetime('now'), datetime('now')),
  ('cat_exp_health',    'expense', 'Kesehatan',  '💊', 50, 1, datetime('now'), datetime('now')),
  ('cat_exp_fun',       'expense', 'Hiburan',    '🎮', 60, 1, datetime('now'), datetime('now')),
  ('cat_misc',          'both',    'Lain-lain',  '❓', 99, 1, datetime('now'), datetime('now'));
`);

  // PERIODS
  db.execSync(`
  CREATE TABLE IF NOT EXISTS periods (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('weekly','monthly','custom')),
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    starting_balance INTEGER NOT NULL,
    ending_balance INTEGER,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

  db.execSync(`
  CREATE INDEX IF NOT EXISTS idx_periods_active
  ON periods (is_active);
`);

  db.execSync(`
  CREATE INDEX IF NOT EXISTS idx_periods_date
  ON periods (start_date DESC);
`);

  // Add period_id to transactions if not exists
  try {
    db.execSync(`
      ALTER TABLE transactions ADD COLUMN period_id TEXT REFERENCES periods(id);
    `);
  } catch {
    // ignore if column already exists
  }

  // Add active_period_id to settings if not exists
  try {
    db.execSync(`
      ALTER TABLE settings ADD COLUMN active_period_id TEXT;
    `);
  } catch {
    // ignore if column already exists
  }

  try {
    db.execSync(`
      ALTER TABLE settings ADD COLUMN auto_period_type TEXT DEFAULT 'monthly';
    `);
  } catch {
    // ignore if column already exists
  }
}
