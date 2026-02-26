import type { ProjectId, TicketId } from '@/types';

/**
 * Frontend Page Route Constants
 * Use these for navigation within the React app
 */
export const PAGE_ROUTES = {
  // Auth pages
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    CHECK_EMAIL: '/check-email',
    RESET_PASSWORD: '/reset-password/:token',
    PASSWORD_RESET_SUCCESS: '/password-reset-success',
    CHANGE_PASSWORD: '/change-password',
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
    DETAIL: '/tickets/:ticketId',
    detail: (ticketId: TicketId) => `/tickets/${ticketId}` as const,
  },

  // Users (admin)
  USERS: {
    LIST: '/members',
  },

  // Testing (admin)
  TESTING: {
    LIST: '/testing',
  },

  // Inbox
  INBOX: {
    ROOT: '/inbox',
  },

  // Notes
  NOTES: {
    ROOT: '/notes',
  },

  // Reports
  REPORTS: {
    ROOT: '/reports',
  },

  // Automations
  AUTOMATIONS: {
    ROOT: '/automations',
  },

  // Projects
  PROJECTS: {
    ROOT: '/projects',
    LIST: '/projects',
    DETAIL: '/projects/:slug',
    CREATE: '/projects/new',
    detail: (slug: ProjectId) => `/projects/${slug}` as const,
  },

  // Clients
  CLIENTS: {
    ROOT: '/clients',
  },

  // Sub-Clients
  SUB_CLIENTS: {
    ROOT: '/team',
  },
  // Settings
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings/profile',
    NOTIFICATION: '/settings/notification',
    SECURITY: '/settings/security',
    CONNECTED_ACCOUNT: '/settings/connected-account',
    INTEGRATIONS: '/settings/integrations',
    PREFERENCE: '/settings/preference',
    BILLING: '/settings/billing',
    APPLICATION: '/settings/application',
    IMPORT_EXPORT: '/settings/import-export',
    API: '/settings/api',
    WORKFLOWS: '/settings/workflows',
    WORKFLOWS_NEW: '/settings/workflows/new',
    WORKFLOWS_EDIT: '/settings/workflows/:id/edit',
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
  TICKET_DETAIL: '/tickets/:ticketId',
  USER_DETAIL: '/users/:id',
  USER_EDIT: '/users/:id/edit',
  PROJECT_DETAIL: '/projects/:slug',
} as const;

// Type exports
export type PageRoute = typeof PAGE_ROUTES;
export type AuthRoute = typeof PAGE_ROUTES.AUTH;
export type DashboardRoute = typeof PAGE_ROUTES.DASHBOARD;
export type TicketRoute = typeof PAGE_ROUTES.TICKETS;
export type UserRoute = typeof PAGE_ROUTES.USERS;
export type TestingRoute = typeof PAGE_ROUTES.TESTING;
export type SettingsRoute = typeof PAGE_ROUTES.SETTINGS;
