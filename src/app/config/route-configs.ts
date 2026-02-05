import { PAGE_ROUTES, ROUTE_PATTERNS } from '@/shared/constants';
import { UserRole } from '@/types';

export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  layout: 'none' | 'main' | 'auth';
  pageConfigKey?: string;
  title?: string;
  group?: string;
  roles?: UserRole[];
}

export const routeConfigs: Record<string, RouteConfig> = {
  // Auth routes
  [PAGE_ROUTES.AUTH.LOGIN]: {
    path: PAGE_ROUTES.AUTH.LOGIN,
    requiresAuth: false,
    layout: 'none',
    title: 'Login',
    group: 'auth',
  },
  [PAGE_ROUTES.AUTH.FORGOT_PASSWORD]: {
    path: PAGE_ROUTES.AUTH.FORGOT_PASSWORD,
    requiresAuth: false,
    layout: 'auth',
    title: 'Forgot Password',
    group: 'auth',
  },
  [PAGE_ROUTES.AUTH.CHECK_EMAIL]: {
    path: PAGE_ROUTES.AUTH.CHECK_EMAIL,
    requiresAuth: false,
    layout: 'auth',
    title: 'Check Email',
    group: 'auth',
  },
  [ROUTE_PATTERNS.RESET_PASSWORD]: {
    path: ROUTE_PATTERNS.RESET_PASSWORD,
    requiresAuth: false,
    layout: 'auth',
    title: 'Reset Password',
    group: 'auth',
  },
  [PAGE_ROUTES.AUTH.PASSWORD_RESET_SUCCESS]: {
    path: PAGE_ROUTES.AUTH.PASSWORD_RESET_SUCCESS,
    requiresAuth: false,
    layout: 'auth',
    title: 'Password Reset Success',
    group: 'auth',
  },

  // Dashboard
  [PAGE_ROUTES.DASHBOARD.ROOT]: {
    path: PAGE_ROUTES.DASHBOARD.ROOT,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'dashboard',
    group: 'dashboard',
  },

  // Tickets
  [PAGE_ROUTES.TICKETS.LIST]: {
    path: PAGE_ROUTES.TICKETS.LIST,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'tickets',
    group: 'tickets',
  },
  [PAGE_ROUTES.TICKETS.CREATE]: {
    path: PAGE_ROUTES.TICKETS.CREATE,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'tickets',
    group: 'tickets',
    roles: [UserRole.CLIENT],
  },
  [ROUTE_PATTERNS.TICKET_DETAIL]: {
    path: ROUTE_PATTERNS.TICKET_DETAIL,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'tickets',
    group: 'tickets',
  },

  // Users
  [PAGE_ROUTES.USERS.LIST]: {
    path: PAGE_ROUTES.USERS.LIST,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'users',
    group: 'users',
    roles: [UserRole.ENG_LEAD],
  },
  [ROUTE_PATTERNS.USER_DETAIL]: {
    path: ROUTE_PATTERNS.USER_DETAIL,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'user-detail',
    group: 'users',
    roles: [UserRole.ENG_LEAD],
  },

  // Testing
  [PAGE_ROUTES.TESTING.LIST]: {
    path: PAGE_ROUTES.TESTING.LIST,
    requiresAuth: true,
    layout: 'main',
    pageConfigKey: 'testing',
    group: 'testing',
    roles: [UserRole.ENG_LEAD, UserRole.ADMIN],
  },
};

// Helper functions
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return routeConfigs[path];
};

export const getRoutesByGroup = (group: string): RouteConfig[] => {
  return Object.values(routeConfigs).filter((config) => config.group === group);
};

export const getProtectedRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs).filter((config) => config.requiresAuth);
};

export const getPublicRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs).filter((config) => !config.requiresAuth);
};
