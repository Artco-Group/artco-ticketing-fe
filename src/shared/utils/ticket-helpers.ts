import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TicketPriorityDisplay,
  getStatusBadgeClasses,
  getCategoryBadgeClasses,
  type Ticket,
  type User,
} from '@artco-group/artco-ticketing-sync';
import type { Filters } from '@/types';
import type { ReactNode } from 'react';
import { StatusIcon, PriorityIcon } from '@/shared/components/ui/BadgeIcons';
import type { BadgeVariant } from '@/shared/components/ui/badge';

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
    bg: 'bg-green-50',
    label: TicketPriorityDisplay[TicketPriority.LOW],
  },
  [TicketPriority.MEDIUM]: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: TicketPriorityDisplay[TicketPriority.MEDIUM],
  },
  [TicketPriority.HIGH]: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: TicketPriorityDisplay[TicketPriority.HIGH],
  },
  [TicketPriority.CRITICAL]: {
    color: 'text-red-600',
    bg: 'bg-red-50',
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

// Badge Configuration System with Icons
interface BadgeConfig {
  variant: BadgeVariant;
  getIcon?: () => ReactNode;
  label?: string;
}

// Status Badge Configuration with StatusIcon factory functions
export const statusBadgeConfig: Record<string, BadgeConfig> = {
  [TicketStatus.NEW]: {
    variant: 'blue',
    getIcon: () =>
      StatusIcon({
        fillPercent: 10,
        color: 'var(--color-info-500)',
        backgroundColor: 'var(--color-info-100)',
      }),
  },
  [TicketStatus.OPEN]: {
    variant: 'orange',
    getIcon: () =>
      StatusIcon({
        fillPercent: 30,
        color: 'var(--color-orange-700)',
        backgroundColor: 'var(--color-orange-100)',
      }),
  },
  [TicketStatus.IN_PROGRESS]: {
    variant: 'yellow',
    getIcon: () =>
      StatusIcon({
        fillPercent: 50,
        color: 'var(--color-warning-500)',
        backgroundColor: 'var(--color-warning-100)',
      }),
  },
  [TicketStatus.RESOLVED]: {
    variant: 'green',
    getIcon: () =>
      StatusIcon({
        fillPercent: 80,
        color: 'var(--color-success-600)',
        backgroundColor: 'var(--color-success-100)',
      }),
  },
  [TicketStatus.CLOSED]: {
    variant: 'grey',
    getIcon: () =>
      StatusIcon({
        fillPercent: 100,
        color: 'var(--color-greyscale-500)',
        backgroundColor: 'var(--color-greyscale-100)',
      }),
  },
};

// Priority Badge Configuration with PriorityIcon factory functions
export const priorityBadgeConfig: Record<string, BadgeConfig> = {
  [TicketPriority.LOW]: {
    variant: 'green',
    getIcon: () =>
      PriorityIcon({
        filledBars: 1,
        color: 'var(--color-success-600)',
        backgroundColor: 'var(--color-success-100)',
      }),
    label: TicketPriorityDisplay[TicketPriority.LOW],
  },
  [TicketPriority.MEDIUM]: {
    variant: 'yellow',
    getIcon: () =>
      PriorityIcon({
        filledBars: 2,
        color: 'var(--color-warning-500)',
        backgroundColor: 'var(--color-warning-100)',
      }),
    label: TicketPriorityDisplay[TicketPriority.MEDIUM],
  },
  [TicketPriority.HIGH]: {
    variant: 'orange',
    getIcon: () =>
      PriorityIcon({
        filledBars: 3,
        color: 'var(--color-orange-700)',
        backgroundColor: 'var(--color-orange-100)',
      }),
    label: TicketPriorityDisplay[TicketPriority.HIGH],
  },
  [TicketPriority.CRITICAL]: {
    variant: 'red',
    getIcon: () =>
      PriorityIcon({
        filledBars: 4,
        color: 'var(--color-error-600)',
        backgroundColor: 'var(--color-error-100)',
      }),
    label: TicketPriorityDisplay[TicketPriority.CRITICAL],
  },
};

// Category Badge Configuration (no icons)
export const categoryBadgeConfig: Record<string, BadgeConfig> = {
  [TicketCategory.BUG]: { variant: 'red' },
  [TicketCategory.FEATURE_REQUEST]: { variant: 'purple' },
  [TicketCategory.QUESTION]: { variant: 'blue' },
  [TicketCategory.OTHER]: { variant: 'grey' },
};
