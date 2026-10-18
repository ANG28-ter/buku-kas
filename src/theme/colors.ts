export const lightColors = {
    // Primary colors - Elegant deep blue-purple
    primary: '#6366F1', // Indigo - more refined than bright purple
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    secondary: '#0EA5E9', // Sky blue - softer than bright blue
    secondaryDark: '#0284C7',
    secondaryLight: '#38BDF8',

    // Background colors - Soft neutrals
    background: '#FAFAFA', // Slightly warmer than pure white
    backgroundSecondary: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceSecondary: '#FAFAFA',

    // Text colors - Rich blacks and grays
    text: '#1F2937', // Warm dark gray instead of pure black
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    // Border colors - Subtle
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Semantic colors - Muted but clear
    success: '#10B981', // Emerald green
    successLight: '#D1FAE5',
    danger: '#EF4444', // Softer red
    dangerLight: '#FEE2E2',
    warning: '#F59E0B', // Amber
    warningLight: '#FEF3C7',
    info: '#3B82F6', // Blue
    infoLight: '#DBEAFE',

    // Income/Expense - Balanced tones
    income: '#10B981',
    expense: '#EF4444',

    // Shadow - Subtle depth
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',
};

export const darkColors = {
    // Primary colors - Softer glows for dark mode
    primary: '#818CF8', // Lighter indigo for better contrast
    primaryDark: '#6366F1',
    primaryLight: '#A5B4FC',
    secondary: '#38BDF8', // Lighter sky blue
    secondaryDark: '#0EA5E9',
    secondaryLight: '#7DD3FC',

    // Background colors - Rich dark tones, not pure black
    background: '#0F172A', // Slate 900 - deep but not harsh
    backgroundSecondary: '#1E293B', // Slate 800
    surface: '#1E293B',
    surfaceSecondary: '#334155', // Slate 700

    // Text colors - Soft whites
    text: '#F1F5F9', // Slate 100 - easier on eyes than pure white
    textSecondary: '#CBD5E1', // Slate 300
    textTertiary: '#94A3B8', // Slate 400

    // Border colors - Subtle separation
    border: '#334155', // Slate 700
    borderLight: '#475569', // Slate 600

    // Semantic colors - Muted for dark mode
    success: '#34D399', // Lighter emerald
    successLight: '#064E3B', // Dark emerald background
    danger: '#F87171', // Lighter red
    dangerLight: '#7F1D1D', // Dark red background
    warning: '#FBBF24', // Lighter amber
    warningLight: '#78350F', // Dark amber background
    info: '#60A5FA', // Lighter blue
    infoLight: '#1E3A8A', // Dark blue background

    // Income/Expense - Softer for dark mode
    income: '#34D399',
    expense: '#F87171',

    // Shadow - Deeper for dark mode
    shadow: 'rgba(0, 0, 0, 0.4)',
    shadowDark: 'rgba(0, 0, 0, 0.6)',
};

export type ColorScheme = typeof lightColors;
