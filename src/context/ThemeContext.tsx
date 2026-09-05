import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'tapar-az-theme';

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeMode {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <ConfigProvider
        theme={{
          algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#6BA8D8',
            colorPrimaryHover: '#5391C7',
            colorPrimaryActive: '#3D82B1',
            colorSuccess: mode === 'dark' ? '#22C55E' : '#16A34A',
            colorSuccessHover: '#15803D',
            colorError: '#EF4444',
            colorWarning: '#EF4444',
            colorInfo: mode === 'dark' ? '#3B82F6' : '#2563EB',
            colorLink: '#6BA8D8',
            colorLinkHover: '#5391C7',
            colorText: mode === 'dark' ? '#FFFFFF' : '#111827',
            colorTextSecondary: mode === 'dark' ? '#A3A3A3' : '#4B5563',
            colorBgBase: mode === 'dark' ? '#0F0F0F' : '#FFFFFF',
            colorBgContainer: mode === 'dark' ? '#1F1F1F' : '#FFFFFF',
            colorFillSecondary: mode === 'dark' ? '#262626' : '#F9FAFB',
            colorBorder: mode === 'dark' ? '#333333' : '#E5E7EB',
            borderRadius: 8,
            fontFamily: '"Inter", system-ui, sans-serif',
          },
          components: {
            Button: {
              colorPrimary: '#6BA8D8',
              colorPrimaryHover: '#5391C7',
              colorPrimaryActive: '#3D82B1',
              colorTextLightSolid: '#FFFFFF',
              borderRadius: 8,
              fontWeight: 600,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
