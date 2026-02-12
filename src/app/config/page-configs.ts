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
    description: 'Overview of your tickets',
    breadcrumbs: [{ label: 'Dashboard' }],
  },
  tickets: {
    title: 'Tickets',
    description: 'Manage support tickets',
    breadcrumbs: [{ label: 'Tickets' }],
  },
  'ticket-detail': {
    title: 'Ticket Details',
    description: 'View and manage ticket',
    breadcrumbs: [{ label: 'Tickets', href: '/tickets' }, { label: 'Details' }],
  },
  users: {
    title: 'Members',
    description: 'Manage team members',
    breadcrumbs: [{ label: 'Members' }],
  },
  'user-detail': {
    title: 'Member Details',
    description: 'View member information',
    breadcrumbs: [{ label: 'Members', href: '/users' }, { label: 'Details' }],
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
