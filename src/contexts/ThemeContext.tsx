import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lightColors, darkColors, type ColorScheme } from '../theme/colors';
import { getTheme, setTheme as saveTheme } from '../repositories/settingsRepo';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
    mode: ThemeMode;
    colors: ColorScheme;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
    children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>('light');

    // Load theme from database on mount
    useEffect(() => {
        try {
            const savedTheme = getTheme();
            setMode(savedTheme);
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    }, []);

    const colors = mode === 'light' ? lightColors : darkColors;

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        try {
            saveTheme(newMode);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const setThemeMode = (newMode: ThemeMode) => {
        setMode(newMode);
        try {
            saveTheme(newMode);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                mode,
                colors,
                toggleTheme,
                setTheme: setThemeMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
