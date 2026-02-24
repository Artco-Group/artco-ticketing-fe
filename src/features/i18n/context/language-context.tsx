/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { QueryKeys } from '@artco-group/artco-ticketing-sync';
import { useAuth } from '@/features/auth/context';
import { apiClient } from '@/shared/lib/api-client';
import { queryClient } from '@/shared/lib/query-client';
import {
  STORAGE_KEY,
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '@/lib/i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    return stored && SUPPORTED_LANGUAGES.includes(stored)
      ? stored
      : DEFAULT_LANGUAGE;
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isAuthenticated && user?.preferences?.language) {
      const userLang = user.preferences.language as SupportedLanguage;
      if (SUPPORTED_LANGUAGES.includes(userLang)) {
        setLanguageState(userLang);
        i18n.changeLanguage(userLang);
        localStorage.setItem(STORAGE_KEY, userLang);
      }
    }
  }, [isAuthenticated, user?.preferences?.language, i18n]);

  const setLanguage = useCallback(
    async (newLang: SupportedLanguage) => {
      if (newLang === language) return;

      setIsLoading(true);
      try {
        await i18n.changeLanguage(newLang);
        setLanguageState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);

        if (isAuthenticated) {
          await apiClient.patch('/users/me/preferences', { language: newLang });
          queryClient.invalidateQueries({
            queryKey: QueryKeys.auth.currentUser(),
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [i18n, isAuthenticated, language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
