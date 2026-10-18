export type DateRange = {
    from: string;  // ISO date string
    to: string;    // ISO date string
};

/**
 * Get start and end of today
 */
export function getToday(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return {
        from: start.toISOString(),
        to: end.toISOString(),
    };
}

/**
 * Get date range for last N days (including today)
 */
export function getLastNDays(days: number): DateRange {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));

    return {
        from: start.toISOString(),
        to: end.toISOString(),
    };
}

/**
 * Get start and end of current month
 */
export function getCurrentMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
        from: start.toISOString(),
        to: end.toISOString(),
    };
}

/**
 * Check if a date string is within the given range (inclusive)
 */
export function isDateInRange(dateStr: string, from: string | null, to: string | null): boolean {
    if (!from && !to) return true;

    const date = new Date(dateStr);

    if (from && date < new Date(from)) return false;
    if (to && date > new Date(to)) return false;

    return true;
}
