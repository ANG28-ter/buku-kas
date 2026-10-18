-- =========================
-- 1) SETTINGS (saldo awal, konfigurasi dasar)
-- =========================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  currency_code TEXT NOT NULL DEFAULT 'IDR',
  initial_balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Pastikan selalu ada 1 row settings (id=1)
INSERT OR IGNORE INTO settings (id, currency_code, initial_balance, created_at, updated_at)
VALUES (1, 'IDR', 0, datetime('now'), datetime('now'));

-- =========================
-- 2) CATEGORIES
-- =========================
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

CREATE INDEX IF NOT EXISTS idx_categories_active_sort
ON categories (is_active, sort_order);

-- =========================
-- 3) TRANSACTIONS (ledger)
-- =========================
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  category_id TEXT NOT NULL,
  note TEXT,
  occurred_at TEXT NOT NULL,     -- kapan transaksi terjadi
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  balance_before INTEGER NOT NULL,
  balance_after  INTEGER NOT NULL,

  is_deleted INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,

  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Index untuk query list ledger (terbaru dulu)
CREATE INDEX IF NOT EXISTS idx_transactions_occurred_at
ON transactions (occurred_at DESC);

-- Index untuk filter non-deleted
CREATE INDEX IF NOT EXISTS idx_transactions_is_deleted
ON transactions (is_deleted);

-- Index gabungan (sering kepakai: list transaksi aktif terbaru)
CREATE INDEX IF NOT EXISTS idx_transactions_active_recent
ON transactions (is_deleted, occurred_at DESC);
