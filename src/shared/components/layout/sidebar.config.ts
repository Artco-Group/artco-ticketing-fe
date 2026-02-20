import { ALL_ROLES, ADMIN_ROLES } from '@artco-group/artco-ticketing-sync';
import { PAGE_ROUTES } from '@/shared/constants';
import { UserRole } from '@/types';
import type { SidebarItem, SidebarFooterSection } from './Sidebar';

// ── Sidebar widths (single source of truth) ───────────

export const SIDEBAR_WIDTH = {
  EXPANDED: '15rem',
  COLLAPSED: '4rem',
} as const;

// ── Route map: item ID → path ─────────────────────────

export const ROUTE_MAP: Record<string, string> = {
  dashboard: PAGE_ROUTES.DASHBOARD.ROOT,
  tickets: PAGE_ROUTES.TICKETS.LIST,
  users: PAGE_ROUTES.USERS.LIST,
  projects: PAGE_ROUTES.PROJECTS.ROOT,
  clients: PAGE_ROUTES.CLIENTS.ROOT,
  reports: PAGE_ROUTES.REPORTS.ROOT,
  profile: PAGE_ROUTES.SETTINGS.PROFILE,
  settings: PAGE_ROUTES.SETTINGS.ROOT,
};

// ── Navigation config ──────────────────────────────────

export interface NavItemConfig extends SidebarItem {
  roles: UserRole[];
}

export const NAVIGATION: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: ALL_ROLES,
  },
  {
    id: 'tickets',
    label: 'Tickets',
    icon: 'tasks',
    roles: ALL_ROLES,
  },
  {
    id: 'users',
    label: 'Members',
    icon: 'user',
    roles: ADMIN_ROLES,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'notes',
    roles: ALL_ROLES,
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'user',
    roles: ADMIN_ROLES,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'reports',
    roles: ALL_ROLES,
  },
];

// ── Footer ─────────────────────────────────────────────

export const FOOTER_SECTIONS: SidebarFooterSection[] = [
  {
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings' },
      { id: 'help', label: 'Help and first step', icon: 'info' },
    ],
  },
];

export const NAV_LABEL_KEYS: Record<string, string> = {
  dashboard: 'navigation.dashboard',
  tickets: 'navigation.tickets',
  users: 'navigation.users',
  projects: 'navigation.projects',
  clients: 'navigation.clients',
  reports: 'navigation.reports',
  settings: 'navigation.settings',
  help: 'navigation.help',
};
