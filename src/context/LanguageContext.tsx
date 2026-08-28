import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import i18n from '@/i18n';

export type Language = 'az' | 'en' | 'ru';
const STORAGE_KEY = 'tapar-az-language';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void } | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'ru' ? stored : 'az';
  });

  useEffect(() => { void i18n.changeLanguage(language); window.localStorage.setItem(STORAGE_KEY, language); }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage: setCurrentLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
