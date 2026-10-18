import { db } from "../db";
import type { Settings } from "../models/domain";

export function getSettings(): Settings {
  const row = db.getFirstSync(
    `SELECT initial_balance, onboarding_done, theme FROM settings WHERE id = 1;`
  ) as any;

  return {
    initial_balance: row?.initial_balance ?? 0,
    onboarding_done: (row?.onboarding_done ?? 0) as 0 | 1,
    theme: (row?.theme ?? 'light') as 'light' | 'dark',
  };
}

export function setInitialBalance(value: number) {
  db.execSync(
    `UPDATE settings
     SET initial_balance = ${value},
         onboarding_done = 1,
         updated_at = datetime('now')
     WHERE id = 1;`
  );

  const row = db.getFirstSync(
    `SELECT initial_balance, onboarding_done FROM settings WHERE id = 1;`
  ) as any;

  console.log("SETTINGS AFTER SAVE:", row);
}

export function getTheme(): 'light' | 'dark' {
  const row = db.getFirstSync(
    `SELECT theme FROM settings WHERE id = 1;`
  ) as any;
  return (row?.theme ?? 'light') as 'light' | 'dark';
}

export function setTheme(theme: 'light' | 'dark') {
  db.execSync(
    `UPDATE settings
     SET theme = '${theme}',
         updated_at = datetime('now')
     WHERE id = 1;`
  );
}
