import { ROUTES } from '../routes/constants';

export interface RouteConfig {
  layout: 'none' | 'main' | 'auth';
  requiresAuth: boolean;
  roles?: ('client' | 'developer' | 'eng_lead')[];
  pageConfigKey?: string;
}

export const routeConfigs: Record<string, RouteConfig> = {
  [ROUTES.AUTH.LOGIN]: {
    requiresAuth: false,
    layout: 'auth',
  },
  [ROUTES.DASHBOARD]: {
    requiresAuth: true,
    layout: 'main',
  },
  [ROUTES.TICKETS.LIST]: {
    requiresAuth: true,
    layout: 'main',
  },
  [ROUTES.USERS.LIST]: {
    requiresAuth: true,
    layout: 'main',
    roles: ['eng_lead'],
  },
};
