import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    border: string;
    shadow: string;
    gradient1: string[];
    gradient2: string[];
    gradient3: string[];
  };
}

const lightColors = {
  background: '#FAFBFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1D29',
  textSecondary: '#6B7280',
  primary: '#6366F1',
  secondary: '#EC4899',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E5E7EB',
  shadow: '#000000',
  gradient1: ['#6366F1', '#8B5CF6', '#EC4899'],
  gradient2: ['#F59E0B', '#EF4444', '#EC4899'],
  gradient3: ['#10B981', '#059669', '#047857'],
};

const darkColors = {
  background: '#0F0F23',
  surface: '#1A1B3A',
  card: '#252659',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  primary: '#818CF8',
  secondary: '#F472B6',
  accent: '#FBBF24',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  border: '#374151',
  shadow: '#000000',
  gradient1: ['#818CF8', '#A78BFA', '#F472B6'],
  gradient2: ['#FBBF24', '#F87171', '#F472B6'],
  gradient3: ['#34D399', '#10B981', '#059669'],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
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