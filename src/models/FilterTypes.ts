export type SortBy = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export type FilterState = {
    dateFrom: string | null;  // ISO date string
    dateTo: string | null;    // ISO date string
    categoryIds: string[];    // array of category IDs
    transactionType: 'all' | 'income' | 'expense';
    sortBy: SortBy;
};

export const DEFAULT_FILTER_STATE: FilterState = {
    dateFrom: null,
    dateTo: null,
    categoryIds: [],
    transactionType: 'all',
    sortBy: 'date-desc',
};
