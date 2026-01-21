import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';
import { UserRole } from '@artco-group/artco-ticketing-sync/enums';

export interface RouteConfig {
  layout: 'none' | 'main' | 'auth';
  requiresAuth: boolean;
  roles?: UserRole[];
  pageConfigKey?: string;
}

export const routeConfigs: Record<string, RouteConfig> = {
  [PAGE_ROUTES.AUTH.LOGIN]: {
    requiresAuth: false,
    layout: 'auth',
  },
  [PAGE_ROUTES.DASHBOARD.ROOT]: {
    requiresAuth: true,
    layout: 'main',
  },
  [PAGE_ROUTES.TICKETS.LIST]: {
    requiresAuth: true,
    layout: 'main',
  },
  [PAGE_ROUTES.USERS.LIST]: {
    requiresAuth: true,
    layout: 'main',
    roles: [UserRole.ENG_LEAD],
  },
};
