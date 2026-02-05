interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageConfig {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

export const pageConfigs: Record<string, PageConfig> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Overview of your tickets and tasks',
    breadcrumbs: [{ label: 'Dashboard' }],
  },
  tickets: {
    title: 'Tasks',
    description: 'Manage support tasks',
    breadcrumbs: [{ label: 'Tasks' }],
  },
  'ticket-detail': {
    title: 'Task Details',
    description: 'View and manage task',
    breadcrumbs: [{ label: 'Tasks', href: '/tickets' }, { label: 'Details' }],
  },
  users: {
    title: 'Users',
    description: 'Manage system users',
    breadcrumbs: [{ label: 'Users' }],
  },
  'user-detail': {
    title: 'User Details',
    description: 'View user information',
    breadcrumbs: [{ label: 'Users', href: '/users' }, { label: 'Details' }],
  },
  inbox: {
    title: 'Inbox',
    description: 'View messages and notifications',
    breadcrumbs: [{ label: 'Inbox' }],
  },
  notes: {
    title: 'Notes',
    description: 'Manage your notes',
    breadcrumbs: [{ label: 'Notes' }],
  },
  reports: {
    title: 'Reports',
    description: 'View reports and analytics',
    breadcrumbs: [{ label: 'Reports' }],
  },
  automations: {
    title: 'Automations',
    description: 'Manage workflow automations',
    breadcrumbs: [{ label: 'Automations' }],
  },
  settings: {
    title: 'Settings',
    description: 'Manage your account settings',
    breadcrumbs: [{ label: 'Settings' }],
  },
};

export type { BreadcrumbItem };
