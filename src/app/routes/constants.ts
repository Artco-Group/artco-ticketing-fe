export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    EMAIL_SENT: '/email-sent',
    RESET_PASSWORD: '/reset-password',
    PASSWORD_RESET_SUCCESS: '/password-reset-success',
  },

  // Dashboard routes
  DASHBOARD: '/dashboard',

  // Ticket routes
  TICKETS: {
    LIST: '/tickets',
    DETAIL: (id: string) => `/tickets/${id}` as const,
    CREATE: '/tickets/new',
  },

  // User routes
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}` as const,
    CREATE: '/users/new',
    EDIT: (id: string) => `/users/${id}/edit` as const,
  },

  // Utility
  NOT_FOUND: '/404',
  HOME: '/',
} as const;

// Route patterns for React Router
export const ROUTE_PATTERNS = {
  RESET_PASSWORD: '/reset-password/:token',
  TICKET_DETAIL: '/tickets/:id',
  USER_DETAIL: '/users/:id',
} as const;

// Helper types for type safety
export type AuthRoutes = (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH];
export type TicketRoutes = (typeof ROUTES.TICKETS)[keyof typeof ROUTES.TICKETS];
export type UserRoutes = (typeof ROUTES.USERS)[keyof typeof ROUTES.USERS];

// Union type of all routes
export type AppRoutes =
  | typeof ROUTES.HOME
  | typeof ROUTES.DASHBOARD
  | typeof ROUTES.NOT_FOUND
  | AuthRoutes
  | TicketRoutes
  | UserRoutes;

// Helper functions for route building
export const buildRoute = {
  ticket: (id: string) => `${ROUTES.TICKETS.DETAIL(id)}`,
  user: (id: string) => `${ROUTES.USERS.DETAIL(id)}`,
  editUser: (id: string) => `${ROUTES.USERS.EDIT(id)}`,
  resetPassword: (token: string) =>
    `${ROUTES.AUTH.RESET_PASSWORD}?token=${token}`,
} as const;
