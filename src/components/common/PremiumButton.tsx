import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type PremiumButtonProps = {
    title?: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    fullWidth?: boolean;
    children?: ReactNode;
};

export function PremiumButton({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    children,
}: PremiumButtonProps) {
    const { colors } = useTheme();

    const sizeStyles = {
        sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 18 },
        md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16, iconSize: 20 },
        lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18, iconSize: 24 },
    };

    const { paddingVertical, paddingHorizontal, fontSize, iconSize } = sizeStyles[size];

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'primary':
                return {
                    container: {
                        backgroundColor: colors.primary,
                        borderWidth: 0,
                    },
                    text: { color: '#FFFFFF' },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: colors.secondary,
                        borderWidth: 0,
                    },
                    text: { color: '#FFFFFF' },
                };
            case 'outline':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: colors.primary,
                    },
                    text: { color: colors.primary },
                };
            case 'ghost':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    },
                    text: { color: colors.text },
                };
            case 'danger':
                return {
                    container: {
                        backgroundColor: colors.danger,
                        borderWidth: 0,
                    },
                    text: { color: '#FFFFFF' },
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical,
                    paddingHorizontal,
                    borderRadius: 14, // Increased for smoother corners
                    gap: 8,
                    opacity: disabled ? 0.5 : 1,
                },
                variantStyles.container,
                fullWidth && { width: '100%' },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variantStyles.text.color} size="small" />
            ) : (
                <>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={iconSize}
                            color={variantStyles.text.color}
                        />
                    )}
                    {title && (
                        <Text
                            style={[
                                {
                                    fontSize,
                                    fontWeight: '600',
                                },
                                variantStyles.text,
                            ]}
                        >
                            {title}
                        </Text>
                    )}
                    {children}
                </>
            )}
        </TouchableOpacity>
    );
}
