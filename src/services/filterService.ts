import type { Transaction } from "../models/domain";
import type { FilterState } from "../models/FilterTypes";
import { isDateInRange } from "../utils/datePresets";

/**
 * Apply all filters to a list of transactions
 */
export function applyFilters(
    transactions: Transaction[],
    filter: FilterState
): Transaction[] {
    let result = [...transactions];

    // Filter by date range
    if (filter.dateFrom || filter.dateTo) {
        result = result.filter((tx) =>
            isDateInRange(tx.occurred_at, filter.dateFrom, filter.dateTo)
        );
    }

    // Filter by transaction type
    if (filter.transactionType !== "all") {
        result = result.filter((tx) => tx.type === filter.transactionType);
    }

    // Filter by categories
    if (filter.categoryIds.length > 0) {
        result = result.filter((tx) => filter.categoryIds.includes(tx.category_id));
    }

    // Apply sorting
    result = applySorting(result, filter.sortBy);

    return result;
}

/**
 * Sort transactions based on sort option
 */
function applySorting(
    transactions: Transaction[],
    sortBy: FilterState["sortBy"]
): Transaction[] {
    const sorted = [...transactions];

    switch (sortBy) {
        case "date-desc":
            // Newest first (default)
            sorted.sort((a, b) => {
                return new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime();
            });
            break;

        case "date-asc":
            // Oldest first
            sorted.sort((a, b) => {
                return new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime();
            });
            break;

        case "amount-desc":
            // Largest amount first
            sorted.sort((a, b) => b.amount - a.amount);
            break;

        case "amount-asc":
            // Smallest amount first
            sorted.sort((a, b) => a.amount - b.amount);
            break;
    }

    return sorted;
}

/**
 * Count active filters (excluding default values)
 */
export function countActiveFilters(filter: FilterState): number {
    let count = 0;

    if (filter.dateFrom || filter.dateTo) count++;
    if (filter.transactionType !== "all") count++;
    if (filter.categoryIds.length > 0) count++;
    if (filter.sortBy !== "date-desc") count++;

    return count;
}
