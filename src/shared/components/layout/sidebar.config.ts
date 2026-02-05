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
  tasks: PAGE_ROUTES.TICKETS.LIST,
  users: PAGE_ROUTES.USERS.LIST,
  projects: PAGE_ROUTES.PROJECTS.ROOT,
  clients: PAGE_ROUTES.CLIENTS.ROOT,
  reports: PAGE_ROUTES.REPORTS.ROOT,
  profile: PAGE_ROUTES.PROFILE,
  settings: PAGE_ROUTES.SETTINGS,
};

// ── Navigation config ──────────────────────────────────

export interface NavItemConfig extends SidebarItem {
  roles: UserRole[];
}

export const NAVIGATION: NavItemConfig[] = [
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'tasks',
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'user',
    roles: [UserRole.ENG_LEAD, UserRole.ADMIN],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'notes',
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'user',
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'reports',
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
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
