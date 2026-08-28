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
            colorPrimary: mode === 'dark' ? '#FFFFFF' : '#0A0A0A',
            colorLink: mode === 'dark' ? '#FFFFFF' : '#0A0A0A',
            borderRadius: 2,
            fontFamily: '"Inter", system-ui, sans-serif',
            colorBgContainer: mode === 'dark' ? '#141414' : '#FFFFFF',
          },
          components: {
            Button: {
              colorPrimary: mode === 'dark' ? '#FFFFFF' : '#0A0A0A',
              colorTextLightSolid: mode === 'dark' ? '#0A0A0A' : '#FFFFFF',
              borderRadius: 2,
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
