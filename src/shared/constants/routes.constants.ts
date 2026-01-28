/**
 * Frontend Page Route Constants
 * Use these for navigation within the React app
 */
export const PAGE_ROUTES = {
  // Auth pages
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    EMAIL_SENT: '/email-sent',
    RESET_PASSWORD: '/reset-password/:token',
    PASSWORD_RESET_SUCCESS: '/password-reset-success',
    resetPassword: (token: string) => `/reset-password/${token}` as const,
  },

  // Dashboard
  DASHBOARD: {
    ROOT: '/dashboard',
    CLIENT: '/dashboard/client',
    DEVELOPER: '/dashboard/developer',
    ENG_LEAD: '/dashboard/lead',
  },

  // Tickets
  TICKETS: {
    LIST: '/tickets',
    DETAIL: '/tickets/:id',
    CREATE: '/tickets/new',
    detail: (id: string) => `/tickets/${id}` as const,
  },

  // Users (admin)
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CREATE: '/users/new',
    EDIT: '/users/:id/edit',
    detail: (id: string) => `/users/${id}` as const,
    edit: (id: string) => `/users/${id}/edit` as const,
  },

  // Testing (admin)
  TESTING: {
    LIST: '/testing',
  },

  // Utility
  HOME: '/',
  NOT_FOUND: '/404',
} as const;

/**
 * Route patterns for React Router definitions
 */
export const ROUTE_PATTERNS = {
  RESET_PASSWORD: '/reset-password/:token',
  TICKET_DETAIL: '/tickets/:id',
  USER_DETAIL: '/users/:id',
  USER_EDIT: '/users/:id/edit',
} as const;

// Type exports
export type PageRoute = typeof PAGE_ROUTES;
export type AuthRoute = typeof PAGE_ROUTES.AUTH;
export type DashboardRoute = typeof PAGE_ROUTES.DASHBOARD;
export type TicketRoute = typeof PAGE_ROUTES.TICKETS;
export type UserRoute = typeof PAGE_ROUTES.USERS;
export type TestingRoute = typeof PAGE_ROUTES.TESTING;
