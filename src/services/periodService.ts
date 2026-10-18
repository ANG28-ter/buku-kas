import { v4 as uuidv4 } from "uuid";
import type { Period } from "../models/domain";
import {
    createPeriod as createPeriodRepo,
    getActivePeriod,
    getAllPeriods,
    closePeriod as closePeriodRepo,
    setActivePeriod,
    updatePeriodStartingBalance,
    getPeriodTransactionCount,
    deletePeriod as deletePeriodRepo,
} from "../repositories/periodRepo";
import { getCurrentBalance, recomputeAllBalances } from "./ledgerService";
import { db } from "../db";

/**
 * Create initial period (called during onboarding)
 */
export function createInitialPeriod(startingBalance: number): Period {
    const now = new Date();
    const monthName = now.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });

    const period = createPeriodRepo("monthly", monthName, startingBalance);

    // Set as active period in settings
    db.execSync(`
    UPDATE settings
    SET active_period_id = '${period.id}',
        updated_at = datetime('now')
    WHERE id = 1;
  `);

    return period;
}

/**
 * Close current period and start new one
 */
export function closePeriodAndStartNew(newPeriodName?: string): Period {
    const currentPeriod = getActivePeriod();

    if (!currentPeriod) {
        throw new Error("No active period found");
    }

    // Get current balance as ending balance
    const endingBalance = getCurrentBalance();

    // Close current period
    closePeriodRepo(currentPeriod.id, endingBalance);

    // Create new period with ending balance as starting balance
    const now = new Date();
    const defaultName =
        newPeriodName ||
        now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    const newPeriod = createPeriodRepo(
        currentPeriod.type,
        defaultName,
        endingBalance
    );

    // Set as active period
    setActivePeriod(newPeriod.id);

    return newPeriod;
}

/**
 * Get period summary (total income, expense, net)
 */
export function getPeriodSummary(periodId: string) {
    // Get period info to include starting balance
    const period = db.getFirstSync(`
        SELECT starting_balance FROM periods WHERE id = '${periodId}';
    `) as any;

    const result = db.getFirstSync(`
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
      COUNT(*) as transaction_count
    FROM transactions
    WHERE period_id = '${periodId}' AND is_deleted = 0;
  `) as any;

    const transactionIncome = result?.total_income ?? 0;
    const totalExpense = result?.total_expense ?? 0;
    const startingBalance = period?.starting_balance ?? 0;

    // Total income includes starting balance + income transactions
    const totalIncome = startingBalance + transactionIncome;
    const net = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        net,
        transactionCount: result?.transaction_count ?? 0,
    };
}

/**
 * Update starting balance of active period
 */
export function updateActivePeriodBalance(newBalance: number) {
    const activePeriod = getActivePeriod();

    if (!activePeriod) {
        throw new Error("No active period found");
    }

    updatePeriodStartingBalance(activePeriod.id, newBalance);

    // Recompute all balances in this period
    recomputeAllBalances();
}

/**
 * Get all periods with summaries
 */
export function getAllPeriodsWithSummary() {
    const periods = getAllPeriods();

    return periods.map((period) => {
        const summary = getPeriodSummary(period.id);
        return {
            ...period,
            ...summary,
        };
    });
}

/**
 * Delete a period and its transactions
 */
import { deleteTransactionsByPeriodId } from "../repositories/periodRepo";

export function deletePeriod(periodId: string) {
    const activePeriod = getActivePeriod();

    // Cannot delete active period
    if (activePeriod?.id === periodId) {
        throw new Error("Cannot delete active period. Please switch to another period first.");
    }

    // Delete all transactions in this period first (Cascading delete)
    deleteTransactionsByPeriodId(periodId);

    // Delete the period
    deletePeriodRepo(periodId);
}
