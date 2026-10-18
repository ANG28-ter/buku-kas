import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { iconNames, iconSizes } from '../../theme/icons';
import { useRef, useEffect } from 'react';

export function ThemeToggle() {
    const { mode, toggleTheme, colors } = useTheme();
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(rotateAnim, {
            toValue: mode === 'dark' ? 1 : 0,
            useNativeDriver: true,
            friction: 8,
        }).start();
    }, [mode]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: colors.surfaceSecondary,
                borderWidth: 1,
                borderColor: colors.border,
            }}
        >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Ionicons
                    name={mode === 'light' ? iconNames.sun : iconNames.moon}
                    size={iconSizes.md}
                    color={colors.primary}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}
