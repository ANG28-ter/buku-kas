import type { ColorScheme } from './colors';

// Icon names mapping
export const iconNames = {
    // Theme
    sun: 'sunny-outline',
    moon: 'moon-outline',

    // Actions
    add: 'add-circle-outline',
    edit: 'create-outline',
    delete: 'trash-outline',
    save: 'checkmark-circle-outline',
    cancel: 'close-circle-outline',

    // Navigation
    back: 'arrow-back',
    forward: 'arrow-forward',

    // Transaction
    income: 'arrow-up-circle',
    expense: 'arrow-down-circle',

    // Filter
    filter: 'funnel-outline',
    sort: 'swap-vertical-outline',

    // Info
    calendar: 'calendar-outline',
    time: 'time-outline',
    wallet: 'wallet-outline',
    card: 'card-outline',

    // UI
    chevronDown: 'chevron-down',
    chevronUp: 'chevron-up',
    chevronRight: 'chevron-forward',
    chevronLeft: 'chevron-back',
    close: 'close',
    checkmark: 'checkmark',
} as const;

// Icon sizes
export const iconSizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 40,
} as const;

// Helper to get themed icon color
export function getIconColor(
    colors: ColorScheme,
    variant: 'primary' | 'secondary' | 'text' | 'success' | 'danger' | 'warning' = 'text'
): string {
    switch (variant) {
        case 'primary':
            return colors.primary;
        case 'secondary':
            return colors.secondary;
        case 'success':
            return colors.success;
        case 'danger':
            return colors.danger;
        case 'warning':
            return colors.warning;
        case 'text':
        default:
            return colors.text;
    }
}
