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
    title: 'Users',
    description: 'Manage system users',
    breadcrumbs: [{ label: 'Users' }],
  },
  'user-detail': {
    title: 'User Details',
    description: 'View user information',
    breadcrumbs: [{ label: 'Users', href: '/users' }, { label: 'Details' }],
  },
};

export type { BreadcrumbItem };
