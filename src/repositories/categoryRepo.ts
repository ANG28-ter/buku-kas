import { db } from "../db";

export type Category = {
  id: string;
  type: "income" | "expense" | "both";
  name: string;
  icon: string | null;
  sort_order: number;
};

export function listActiveCategories(type?: "income" | "expense"): Category[] {
  if (!type) {
    return db.getAllSync(
      `SELECT id, type, name, icon, sort_order
       FROM categories
       WHERE is_active = 1
       ORDER BY sort_order ASC;`
    ) as any[];
  }

  return db.getAllSync(
    `SELECT id, type, name, icon, sort_order
     FROM categories
     WHERE is_active = 1 AND (type = '${type}' OR type = 'both')
     ORDER BY sort_order ASC;`
  ) as any[];
}
