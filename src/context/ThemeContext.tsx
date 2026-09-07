import { createContext, useContext, type ReactNode } from 'react';
import { ConfigProvider } from 'antd';

interface ThemeContextValue {
  mode: 'light';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', toggle: () => undefined });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ mode: 'light', toggle: () => undefined }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#611F69',
            colorPrimaryHover: '#4F1956',
            colorPrimaryActive: '#3C1241',
            colorSuccess: '#16A34A',
            colorSuccessHover: '#15803D',
            colorError: '#EF4444',
            colorWarning: '#EF4444',
            colorInfo: '#2563EB',
            colorLink: '#611F69',
            colorLinkHover: '#4F1956',
            colorText: '#111827',
            colorTextSecondary: '#4B5563',
            colorBgBase: '#FFFFFF',
            colorBgContainer: '#FFFFFF',
            colorFillSecondary: '#F9FAFB',
            colorBorder: '#E5E7EB',
            borderRadius: 8,
            fontFamily: '"Inter", system-ui, sans-serif',
          },
          components: {
            Button: {
              colorPrimary: '#611F69',
              colorPrimaryHover: '#4F1956',
              colorPrimaryActive: '#3C1241',
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
  return useContext(ThemeContext);
}
