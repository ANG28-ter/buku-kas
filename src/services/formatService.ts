import type { Transaction } from "../models/domain";
import { toDayKey } from "../utils/dates";

export type DayGroup = {
  dayKey: string;
  income: number;
  expense: number;
  net: number;
  items: Transaction[];
};

export function groupByDay(transactions: Transaction[]): DayGroup[] {
  const map = new Map<string, DayGroup>();

  for (const tx of transactions) {
    const key = toDayKey(tx.occurred_at);
    if (!map.has(key)) {
      map.set(key, { dayKey: key, income: 0, expense: 0, net: 0, items: [] });
    }
    const g = map.get(key)!;
    g.items.push(tx);

    if (tx.type === "income") g.income += tx.amount;
    else g.expense += tx.amount;

    g.net = g.income - g.expense;
  }

  // urutkan dayKey desc (terbaru di atas)
  return Array.from(map.values()).sort((a, b) =>
    a.dayKey < b.dayKey ? 1 : -1
  );
}
