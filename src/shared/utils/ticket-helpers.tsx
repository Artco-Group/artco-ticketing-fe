import type { ReactNode } from 'react';
import {
  TicketPriorityDisplay,
  TicketStatusSortOrder,
  TicketPrioritySortOrder,
  getStatusBadgeClasses,
  getCategoryBadgeClasses,
} from '@artco-group/artco-ticketing-sync';
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  type Ticket,
  type User,
  type Filters,
} from '@/types';
import { StatusIcon, PriorityIcon } from '@/shared/components/ui/BadgeIcons';
import { Icon } from '@/shared/components/ui/Icon';

/**
 * Type for assignedTo field (always populated object from API)
 */
export type AssignedToValue =
  | { id?: string | null; email?: string | null; name?: string | null }
  | null
  | undefined;

/**
 * Extract assignee ID from ticket.assignedTo
 */
export function getAssigneeId(assignedTo: AssignedToValue): string {
  return assignedTo?.id || '';
}

/**
 * Extract assignee email from ticket.assignedTo
 */
export function getAssigneeEmail(assignedTo: AssignedToValue): string {
  return assignedTo?.email || '';
}

/**
 * Extract assignee name from ticket.assignedTo
 */
export function getAssigneeName(assignedTo: AssignedToValue): string {
  return assignedTo?.name || 'Unassigned';
}

/**
 * Resolve assignee name by looking up in users array.
 * Falls back to extracting from assignedTo object if user not found.
 */
export function resolveAssigneeName(
  assignedTo: AssignedToValue,
  users: User[]
): string {
  if (!assignedTo) return 'Unassigned';

  // Try to find matching user for fresh data
  const user = users.find(
    (u) => u.id === assignedTo.id || u.email === assignedTo.email
  );
  return user?.name || assignedTo.name || assignedTo.email || 'Unassigned';
}

/**
 * Filter tickets based on provided filters
 */
export function filterTickets(
  tickets: Ticket[],
  filters: Filters,
  options?: {
    clientEmail?: string;
    isEngLead?: boolean;
  }
): Ticket[] {
  return tickets.filter((ticket) => {
    // Status filter
    if (filters.status !== 'All' && ticket.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'All' && ticket.priority !== filters.priority) {
      return false;
    }

    // EngLead-only filters
    if (options?.isEngLead) {
      // Client filter
      if (filters.client !== 'All' && ticket.clientEmail !== filters.client) {
        return false;
      }

      // Assignee filter
      if (filters.assignee !== 'All') {
        if (filters.assignee === 'Unassigned' && ticket.assignedTo) {
          return false;
        }
        if (filters.assignee !== 'Unassigned') {
          const assigneeEmail = getAssigneeEmail(ticket.assignedTo);
          if (assigneeEmail !== filters.assignee) {
            return false;
          }
        }
      }
    }

    return true;
  });
}

/**
 * Sort tickets based on sortBy field
 */
export function sortTickets(tickets: Ticket[], sortBy: string): Ticket[] {
  return [...tickets].sort((a, b) => {
    switch (sortBy) {
      case 'Title':
        return (a.title || '').localeCompare(b.title || '');

      case 'Ticket ID':
        return (a.ticketId || '').localeCompare(b.ticketId || '');

      case 'Category':
        return (a.category || '').localeCompare(b.category || '');

      case 'Status':
        return (
          (TicketStatusSortOrder[a.status as TicketStatus] ?? 0) -
          (TicketStatusSortOrder[b.status as TicketStatus] ?? 0)
        );

      case 'Priority':
        return (
          (TicketPrioritySortOrder[b.priority as TicketPriority] ?? 0) -
          (TicketPrioritySortOrder[a.priority as TicketPriority] ?? 0)
        );

      case 'Client':
        return (a.clientEmail || '').localeCompare(b.clientEmail || '');

      case 'Assignee': {
        const aName = getAssigneeName(a.assignedTo);
        const bName = getAssigneeName(b.assignedTo);
        return aName.localeCompare(bName);
      }

      case 'Created Date':
      default:
        return (
          new Date(b.createdAt || '').getTime() -
          new Date(a.createdAt || '').getTime()
        );
    }
  });
}

export const statusColors: Record<string, string> = {
  [TicketStatus.NEW]: getStatusBadgeClasses(TicketStatus.NEW),
  [TicketStatus.OPEN]: getStatusBadgeClasses(TicketStatus.OPEN),
  [TicketStatus.IN_PROGRESS]: getStatusBadgeClasses(TicketStatus.IN_PROGRESS),
  [TicketStatus.RESOLVED]: getStatusBadgeClasses(TicketStatus.RESOLVED),
  [TicketStatus.CLOSED]: getStatusBadgeClasses(TicketStatus.CLOSED),
};

interface PriorityConfigValue {
  color: string;
  bg: string;
  label: string;
}

export const priorityConfig: Record<string, PriorityConfigValue> = {
  [TicketPriority.LOW]: {
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: TicketPriorityDisplay[TicketPriority.LOW],
  },
  [TicketPriority.MEDIUM]: {
    color: 'text-warning-500',
    bg: 'bg-warning-100',
    label: TicketPriorityDisplay[TicketPriority.MEDIUM],
  },
  [TicketPriority.HIGH]: {
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    label: TicketPriorityDisplay[TicketPriority.HIGH],
  },
  [TicketPriority.CRITICAL]: {
    color: 'text-error-500',
    bg: 'bg-error-100',
    label: TicketPriorityDisplay[TicketPriority.CRITICAL],
  },
};

export const categoryColors: Record<string, string> = {
  [TicketCategory.BUG]: getCategoryBadgeClasses(TicketCategory.BUG),
  [TicketCategory.FEATURE_REQUEST]: getCategoryBadgeClasses(
    TicketCategory.FEATURE_REQUEST
  ),
  [TicketCategory.QUESTION]: getCategoryBadgeClasses(TicketCategory.QUESTION),
  [TicketCategory.OTHER]: getCategoryBadgeClasses(TicketCategory.OTHER),
};

/**
 * Badge configuration interface
 */
interface BadgeConfig {
  label: string;
  getIcon?: () => ReactNode;
}

/**
 * Status badge configuration with variants and icons
 */
export const statusBadgeConfig: Record<TicketStatus, BadgeConfig> = {
  [TicketStatus.NEW]: {
    label: 'New',
    getIcon: () => <StatusIcon fillPercent={10} variant="blue" />,
  },
  [TicketStatus.OPEN]: {
    label: 'Open',
    getIcon: () => <StatusIcon fillPercent={25} variant="yellow" />,
  },
  [TicketStatus.IN_PROGRESS]: {
    label: 'In Progress',
    getIcon: () => <StatusIcon fillPercent={45} variant="orange" />,
  },
  [TicketStatus.RESOLVED]: {
    label: 'Resolved',
    getIcon: () => <StatusIcon fillPercent={80} variant="green" />,
  },
  [TicketStatus.CLOSED]: {
    label: 'Closed',
    getIcon: () => <StatusIcon fillPercent={100} variant="grey" />,
  },
};

/**
 * Priority badge configuration with variants and icons
 */
export const priorityBadgeConfig: Record<TicketPriority, BadgeConfig> = {
  [TicketPriority.LOW]: {
    label: 'Low',
    getIcon: () => <PriorityIcon filledBars={1} variant="green" />,
  },
  [TicketPriority.MEDIUM]: {
    label: 'Medium',
    getIcon: () => <PriorityIcon filledBars={2} variant="yellow" />,
  },
  [TicketPriority.HIGH]: {
    label: 'High',
    getIcon: () => <PriorityIcon filledBars={3} variant="orange" />,
  },
  [TicketPriority.CRITICAL]: {
    label: 'Critical',
    getIcon: () => <PriorityIcon filledBars={4} variant="red" />,
  },
};

/**
 * Category badge configuration with variants and icons
 */
export const categoryBadgeConfig: Record<TicketCategory, BadgeConfig> = {
  [TicketCategory.BUG]: {
    label: 'Bug',
    getIcon: () => <Icon name="bug" size="sm" className="text-red-500" />,
  },
  [TicketCategory.FEATURE_REQUEST]: {
    label: 'Feature Request',
    getIcon: () => (
      <Icon name="feature" size="sm" className="text-purple-500" />
    ),
  },
  [TicketCategory.QUESTION]: {
    label: 'Question',
    getIcon: () => <Icon name="question" size="sm" className="text-blue-500" />,
  },
  [TicketCategory.OTHER]: {
    label: 'Other',
    getIcon: () => <Icon name="tag" size="sm" className="text-gray-500" />,
  },
};

/**
 * Get the icon for a given priority
 */
export function getPriorityIcon(priority: TicketPriority): ReactNode {
  return priorityBadgeConfig[priority]?.getIcon?.() ?? null;
}

/**
 * Get the icon for a given status
 */
export function getStatusIcon(status: TicketStatus): ReactNode {
  return statusBadgeConfig[status]?.getIcon?.() ?? null;
}

/**
 * Get the label for a given priority
 */
export function getPriorityLabel(priority: TicketPriority): string {
  return priorityBadgeConfig[priority]?.label ?? '';
}

/**
 * Get the label for a given status
 */
export function getStatusLabel(status: TicketStatus): string {
  return statusBadgeConfig[status]?.label ?? '';
}

/**
 * Get the icon for a given category
 */
export function getCategoryIcon(category: TicketCategory): ReactNode {
  return categoryBadgeConfig[category]?.getIcon?.() ?? null;
}

/**
 * Get the label for a given category
 */
export function getCategoryLabel(category: TicketCategory): string {
  return categoryBadgeConfig[category]?.label ?? '';
}
