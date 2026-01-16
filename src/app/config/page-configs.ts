// src/app/config/page-configs.ts
export interface PageConfig {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
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
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tickets' },
    ],
  },
};
