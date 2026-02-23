import { PAGE_ROUTES } from '@/shared/constants/routes.constants';

/**
 * Settings sidebar navigation configuration
 */
export const SETTINGS_GROUPS_CONFIG = [
  {
    titleKey: 'sidebar.account',
    items: [
      {
        id: 'profile',
        labelKey: 'sidebar.profile',
        icon: 'profile',
        href: PAGE_ROUTES.SETTINGS.PROFILE,
      },
      {
        id: 'notification',
        labelKey: 'sidebar.notification',
        icon: 'notification',
        href: PAGE_ROUTES.SETTINGS.NOTIFICATION,
      },
      {
        id: 'security',
        labelKey: 'sidebar.security',
        icon: 'security',
        href: PAGE_ROUTES.SETTINGS.SECURITY,
      },
    ],
  },
  {
    titleKey: 'sidebar.administration',
    items: [
      {
        id: 'preference',
        labelKey: 'sidebar.preference',
        icon: 'preference',
        href: PAGE_ROUTES.SETTINGS.PREFERENCE,
      },
      {
        id: 'workflows',
        labelKey: 'sidebar.statusConfigs',
        icon: 'tasks',
        href: PAGE_ROUTES.SETTINGS.WORKFLOWS,
      },
    ],
  },
] as const;

/**
 * Valid settings sections for route validation
 */
export const VALID_SETTINGS_SECTIONS = [
  'profile',
  'notification',
  'security',
  'preference',
  'workflows',
] as const;

export type SettingsSection = (typeof VALID_SETTINGS_SECTIONS)[number];
