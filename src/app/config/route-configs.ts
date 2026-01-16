import { ROUTES } from '../routes/constants';
import { UserRole } from '@/types';

export interface RouteConfig {
  layout: 'none' | 'main' | 'auth';
  requiresAuth: boolean;
  roles?: UserRole[];
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
    roles: [UserRole.EngLead],
  },
};
