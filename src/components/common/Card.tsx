import { View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ReactNode } from 'react';

type CardProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'gradient';
    padding?: 'none' | 'sm' | 'md' | 'lg';
};

export function Card({ children, style, variant = 'default', padding = 'md' }: CardProps) {
    const { colors, mode } = useTheme();

    const paddingValues = {
        none: 0,
        sm: 12,
        md: 16,
        lg: 20,
    };

    const baseStyle: ViewStyle = {
        borderRadius: 20, // Increased for smoother corners
        padding: paddingValues[padding],
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 }, // Slightly more vertical offset
        shadowOpacity: mode === 'light' ? 0.08 : 0.25, // More subtle in light mode
        shadowRadius: 12, // Softer shadow spread
        elevation: 4,
    };

    if (variant === 'gradient') {
        return (
            <View
                style={[
                    baseStyle,
                    {
                        backgroundColor: mode === 'light' ? colors.primary : colors.surface,
                    },
                    style,
                ]}
            >
                {children}
            </View>
        );
    }

    return (
        <View
            style={[
                baseStyle,
                {
                    backgroundColor: colors.surface,
                    borderWidth: mode === 'light' ? 0 : 1, // No border in light mode for cleaner look
                    borderColor: colors.border,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}
