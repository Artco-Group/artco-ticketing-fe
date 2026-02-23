import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enErrors from '@/locales/en/errors.json';
import enTickets from '@/locales/en/tickets.json';
import enProjects from '@/locales/en/projects.json';
import enUsers from '@/locales/en/users.json';
import enSettings from '@/locales/en/settings.json';
import enDashboard from '@/locales/en/dashboard.json';
import enClients from '@/locales/en/clients.json';

import bsCommon from '@/locales/bs/common.json';
import bsAuth from '@/locales/bs/auth.json';
import bsErrors from '@/locales/bs/errors.json';
import bsTickets from '@/locales/bs/tickets.json';
import bsProjects from '@/locales/bs/projects.json';
import bsUsers from '@/locales/bs/users.json';
import bsSettings from '@/locales/bs/settings.json';
import bsDashboard from '@/locales/bs/dashboard.json';
import bsClients from '@/locales/bs/clients.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    errors: enErrors,
    tickets: enTickets,
    projects: enProjects,
    users: enUsers,
    settings: enSettings,
    dashboard: enDashboard,
    clients: enClients,
  },
  bs: {
    common: bsCommon,
    auth: bsAuth,
    errors: bsErrors,
    tickets: bsTickets,
    projects: bsProjects,
    users: bsUsers,
    settings: bsSettings,
    dashboard: bsDashboard,
    clients: bsClients,
  },
} as const;

export const SUPPORTED_LANGUAGES = ['en', 'bs'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const STORAGE_KEY = 'artco-language';

export const LANGUAGE_OPTIONS: { label: string; value: SupportedLanguage }[] = [
  { label: 'English', value: 'en' },
  { label: 'Bosanski', value: 'bs' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: 'common',
    ns: [
      'common',
      'auth',
      'errors',
      'tickets',
      'projects',
      'users',
      'settings',
      'dashboard',
      'clients',
    ],

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
