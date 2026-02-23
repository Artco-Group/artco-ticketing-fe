import { type IconName } from '@/shared/components/ui';
import { type StatColorVariant } from '@/shared/components/composite/StatsCard';

export const statConfig: Record<
  string,
  { icon: IconName; color: StatColorVariant; href?: string }
> = {
  totalProjects: { icon: 'grid', color: 'blue', href: '/projects?tab=all' },
  totalUsers: { icon: 'all', color: 'purple', href: '/members' },
  totalTickets: { icon: 'inbox', color: 'teal', href: '/tickets?tab=all' },
  backlogTickets: {
    icon: 'backlog',
    color: 'orange',
    href: '/tickets?tab=backlog',
  },
  myProjects: { icon: 'grid', color: 'blue', href: '/projects' },
  openTickets: { icon: 'inbox', color: 'orange', href: '/tickets?tab=active' },
  resolvedTickets: {
    icon: 'done',
    color: 'green',
    href: '/tickets?tab=resolved',
  },
  assignedTickets: { icon: 'inbox', color: 'blue', href: '/tickets?tab=all' },
  inProgress: {
    icon: 'in-progress',
    color: 'orange',
    href: '/tickets?tab=active',
  },
  completed: { icon: 'done', color: 'green', href: '/tickets?tab=resolved' },
  projectsLed: { icon: 'reports', color: 'blue', href: '/projects' },
  teamMembers: { icon: 'all', color: 'purple', href: '/members' },
  pendingReview: { icon: 'eye', color: 'teal', href: '/tickets?tab=active' },
} as const;

export const defaultStatConfig = {
  icon: 'info' as IconName,
  color: 'blue' as StatColorVariant,
} as const;
