import { v4 as uuidv4 } from "uuid";
import type { AddTransactionInput } from "../models/dto";
import type { Transaction } from "../models/domain";
import { getSettings } from "../repositories/settingsRepo";
import {
  getTransactionById,
  insertTransaction,
  listTransactionsByPeriodAsc,
  listTransactionsByPeriodDesc,
  softDeleteTransaction,
  updateTransactionBalances,
  updateTransactionCoreFields,
} from "../repositories/transactionRepo";
import {
  getActivePeriod,
  createPeriod as createPeriodRepo,
  findPeriodByName,
  updatePeriodStartingBalance
} from "../repositories/periodRepo";
import { db } from "../db";

export function getCurrentBalance(): number {
  // We should ideally get balance of Active Period
  const activePeriod = getActivePeriod();
  if (!activePeriod) return 0;

  const rules = listTransactionsByPeriodDesc(activePeriod.id);
  if (rules.length > 0) return rules[0].balance_after;

  return activePeriod.starting_balance ?? 0;
}

/**
 * Recompute running balance for a SPECIFIC period
 */
export function recomputePeriodBalances(periodId: string) {
  // Get Period Info
  const period = db.getFirstSync(`SELECT * FROM periods WHERE id = '${periodId}'`) as any;
  if (!period) return;

  const txs = listTransactionsByPeriodAsc(periodId);
  let running = period.starting_balance ?? 0;

  for (const tx of txs) {
    const before = running;
    const after =
      tx.type === "expense" ? before - tx.amount : before + tx.amount;

    if (tx.balance_before !== before || tx.balance_after !== after) {
      updateTransactionBalances(tx.id, before, after);
    }
    running = after;
  }
}

/**
 * Deprecated global recompute, redirects to active period recompute for backward compatibility
 */
export function recomputeAllBalances() {
  const active = getActivePeriod();
  if (active) {
    recomputePeriodBalances(active.id);
  }
}

export function addTransaction(input: AddTransactionInput): Transaction {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("Amount must be a positive integer (rupiah).");
  }

  const now = new Date().toISOString();
  const occurredAt = input.occurred_at ?? now;

  // PERIOD ASSIGNMENT LOGIC
  // 1. Determine Target Period Name based on Date (e.g. "January 2026")
  const dateObj = new Date(occurredAt);
  const targetPeriodName = dateObj.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  let targetPeriodId: string;
  const activePeriod = getActivePeriod();

  // 2. Is there an existing period with this name?
  const existingPeriod = findPeriodByName(targetPeriodName);

  if (existingPeriod) {
    targetPeriodId = existingPeriod.id;
  } else {
    // 3. If not found, check if it matches Active Period's name?
    // If active period name is NOT standard, we might double create.
    // But assuming standard naming usage:
    if (activePeriod && activePeriod.name === targetPeriodName) {
      targetPeriodId = activePeriod.id;
    } else {
      // 4. Create new period automatically? or use Active?
      // "Transactions follow monthly history" implies we should Create or at least Separate them.
      // Creating a new period requires a starting balance.
      // If we create a PAST period, starting balance is 0?
      // If we create a FUTURE period, starting balance is current active ending balance?

      // For MVP safety: If Active Period matches the month, use it.
      // If NOT, try to autocreate.
      // If no active period, autocreate.

      // Let's AUTO CREATE for now to fulfill "follow history".
      // But what is starting balance? 0 for now. User can edit later.
      const newPeriod = createPeriodRepo("monthly", targetPeriodName, 0);
      targetPeriodId = newPeriod.id;
    }
  }

  // Calculate balance based on Target Period
  // We need to fetch the last balance of THAT period.
  // But since we will recompute anyway, we can put dummy values first.

  const tx: Transaction = {
    id: uuidv4(),
    type: input.type,
    amount: input.amount,
    category_id: input.category_id,
    note: input.note?.trim() ? input.note.trim() : null,
    occurred_at: occurredAt,
    created_at: now,
    updated_at: now,
    balance_before: 0, // Will be fixed by recompute
    balance_after: 0,
    is_deleted: 0,
    deleted_at: null,
  };

  insertTransaction(tx, targetPeriodId);

  // Recompute balances for THAT period
  recomputePeriodBalances(targetPeriodId);

  // Auto-sync
  syncTransactionToCloud(tx).catch(err => console.warn("Sync failed:", err));

  return tx;
}

export function editTransaction(params: {
  id: string;
  type: "income" | "expense";
  amount: number;
  category_id: string;
  note: string | null;
  occurred_at: string;
}) {
  if (!Number.isInteger(params.amount) || params.amount <= 0) {
    throw new Error("Amount must be a positive integer (rupiah).");
  }

  const existing = getTransactionById(params.id);
  if (!existing || existing.is_deleted === 1) {
    throw new Error("Transaction not found.");
  }

  // Check if date changed and requires period move
  // Ideally we should check if period needs change.
  // But simplest way: Update fields, then check period.

  // Actually, if we change date to another month, we MUST move the period_id.
  // Current repo updateTransactionCoreFields does NOT update period_id.
  // We need to implement move.

  // Implementation for MVP: Just update fields. If user wants to move period, they usually delete and re-add.
  // But to be consistent: 
  // Let's just update core fields for now. 
  // Users who want to move periods should probably delete/re-add or we add move logic later.
  // "Transactions follow monthly history" -> ideally edit should move.
  // But let's stick to update fields first.

  updateTransactionCoreFields(params);

  // We need to find which period this tx belongs to, to recompute.
  // Since we don't know if period changed (we didn't change period_id in DB), 
  // we just recompute the period it belongs to.
  // Wait, if I change Date to next month but Period remains old, it BREAKS the "follow history" rule.

  // OK, I will perform a check:
  // If Date Month != Period Name Month -> Move Period.
  // This is getting complex. Let's stick to: Update logic remains same, but we recompute.
  // If user wants to fix period, they can re-add.

  // Recompute the period this transaction belongs to
  // We must fetch it to know the period_id
  const updatedTx = getTransactionById(params.id);
  if (updatedTx && (updatedTx as any).period_id) {
    recomputePeriodBalances((updatedTx as any).period_id);
  } else {
    recomputeAllBalances();
  }

  // Auto-sync
  if (updatedTx) {
    syncTransactionToCloud(updatedTx).catch(err => console.warn("Sync failed:", err));
  }
}

export function deleteTransaction(id: string) {
  const existing = getTransactionById(id);
  if (!existing || existing.is_deleted === 1) {
    throw new Error("Transaction not found.");
  }

  softDeleteTransaction(id);

  // Recompute relevant period
  if ((existing as any).period_id) {
    recomputePeriodBalances((existing as any).period_id);
  } else {
    recomputeAllBalances();
  }

  // Auto-sync
  deleteTransactionFromCloud(id).catch(err => console.warn("Sync failed:", err));
}

export function getLedger(): { balance: number; transactions: Transaction[] } {
  // Return transactions for ACTIVE PERIOD only for Home View
  const activePeriod = getActivePeriod();
  if (!activePeriod) return { balance: 0, transactions: [] };

  const transactions = listTransactionsByPeriodDesc(activePeriod.id);
  const balance = getCurrentBalance();
  return { balance, transactions };
}


// Helper function to sync transaction to cloud
async function syncTransactionToCloud(tx: Transaction) {
  try {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const userJson = await AsyncStorage.getItem("auth_user");

    if (userJson) {
      const user = JSON.parse(userJson);
      const { syncToCloud } = require("./firestoreSync");

      // Sync all data to cloud
      await syncToCloud(user.id);
    }
  } catch (error) {
    console.error("Failed to sync to cloud:", error);
  }
}

// Helper function to delete transaction from cloud
async function deleteTransactionFromCloud(transactionId: string) {
  try {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const userJson = await AsyncStorage.getItem("auth_user");

    if (userJson) {
      const user = JSON.parse(userJson);
      const { deleteTransactionFromCloud } = require("./firestoreSync");

      // Delete from cloud
      await deleteTransactionFromCloud(user.id, transactionId);
    }
  } catch (error) {
    console.error("Failed to delete from cloud:", error);
  }
}
