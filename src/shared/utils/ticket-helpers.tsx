import type { ReactNode } from 'react';
import {
  TicketPriorityDisplay,
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
import type { BadgeVariant } from '@/shared/components/ui/badge';
import { StatusIcon, PriorityIcon } from '@/shared/components/ui/BadgeIcons';

/**
 * Priority order for sorting (highest first)
 */
export const PRIORITY_ORDER: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Status order for sorting
 */
export const STATUS_ORDER: Record<string, number> = {
  New: 1,
  Open: 2,
  'In Progress': 3,
  Resolved: 4,
  Closed: 5,
};

/**
 * Type for assignedTo field which can be string, User-like object, or null/undefined
 * Uses Nullable pattern to match sync package types
 */
export type AssignedToValue =
  | string
  | { _id?: string | null; email?: string | null; name?: string | null }
  | null
  | undefined;

/**
 * Type guard to check if assignedTo is a User-like object (not a string)
 */
export function isAssignedToObject(assignedTo: AssignedToValue): assignedTo is {
  _id?: string | null;
  email?: string | null;
  name?: string | null;
} {
  return (
    assignedTo !== null &&
    assignedTo !== undefined &&
    typeof assignedTo === 'object'
  );
}

/**
 * Extract assignee ID from ticket.assignedTo which can be string or User object
 */
export function getAssigneeId(assignedTo: AssignedToValue): string {
  if (!assignedTo) return '';
  if (typeof assignedTo === 'string') return assignedTo;
  return assignedTo._id || '';
}

/**
 * Extract assignee email from ticket.assignedTo
 */
export function getAssigneeEmail(assignedTo: AssignedToValue): string {
  if (!assignedTo) return '';
  if (typeof assignedTo === 'string') return assignedTo;
  return assignedTo.email || '';
}

/**
 * Extract assignee name from ticket.assignedTo
 */
export function getAssigneeName(assignedTo: AssignedToValue): string {
  if (!assignedTo) return 'Unassigned';
  if (typeof assignedTo === 'string') return assignedTo;
  return assignedTo.name || 'Unassigned';
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

  if (typeof assignedTo === 'string') {
    // Try to find user by ID or email
    const user = users.find(
      (u) => u._id === assignedTo || u.email === assignedTo
    );
    return user?.name || assignedTo;
  }

  // assignedTo is an object - try to find matching user
  const user = users.find(
    (u) => u._id === assignedTo._id || u.email === assignedTo.email
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
      case 'Status':
        return (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0);

      case 'Priority':
        return (
          (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0)
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
  variant: BadgeVariant;
  label: string;
  getIcon?: () => ReactNode;
}

/**
 * Status badge configuration with variants and icons
 */
export const statusBadgeConfig: Record<TicketStatus, BadgeConfig> = {
  [TicketStatus.NEW]: {
    variant: 'blue',
    label: 'New',
    getIcon: () => <StatusIcon fillPercent={10} variant="blue" />,
  },
  [TicketStatus.OPEN]: {
    variant: 'yellow',
    label: 'Open',
    getIcon: () => <StatusIcon fillPercent={25} variant="yellow" />,
  },
  [TicketStatus.IN_PROGRESS]: {
    variant: 'orange',
    label: 'In Progress',
    getIcon: () => <StatusIcon fillPercent={45} variant="orange" />,
  },
  [TicketStatus.RESOLVED]: {
    variant: 'green',
    label: 'Resolved',
    getIcon: () => <StatusIcon fillPercent={80} variant="green" />,
  },
  [TicketStatus.CLOSED]: {
    variant: 'grey',
    label: 'Closed',
    getIcon: () => <StatusIcon fillPercent={100} variant="grey" />,
  },
};

/**
 * Priority badge configuration with variants and icons
 */
export const priorityBadgeConfig: Record<TicketPriority, BadgeConfig> = {
  [TicketPriority.LOW]: {
    variant: 'green',
    label: 'Low',
    getIcon: () => <PriorityIcon filledBars={1} variant="green" />,
  },
  [TicketPriority.MEDIUM]: {
    variant: 'yellow',
    label: 'Medium',
    getIcon: () => <PriorityIcon filledBars={2} variant="yellow" />,
  },
  [TicketPriority.HIGH]: {
    variant: 'orange',
    label: 'High',
    getIcon: () => <PriorityIcon filledBars={3} variant="orange" />,
  },
  [TicketPriority.CRITICAL]: {
    variant: 'red',
    label: 'Critical',
    getIcon: () => <PriorityIcon filledBars={4} variant="red" />,
  },
};

/**
 * Category badge configuration with variants
 */
export const categoryBadgeConfig: Record<TicketCategory, BadgeConfig> = {
  [TicketCategory.BUG]: {
    variant: 'orange',
    label: 'Bug',
  },
  [TicketCategory.FEATURE_REQUEST]: {
    variant: 'teal',
    label: 'Feature Request',
  },
  [TicketCategory.QUESTION]: {
    variant: 'purple',
    label: 'Question',
  },
  [TicketCategory.OTHER]: {
    variant: 'grey',
    label: 'Other',
  },
};
