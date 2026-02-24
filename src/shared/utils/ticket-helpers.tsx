import type { ReactNode } from 'react';
import {
  TicketStatusSortOrder,
  TicketPrioritySortOrder,
  DEFAULT_STATUS_GROUPS,
  DEFAULT_STATUSES,
} from '@artco-group/artco-ticketing-sync';
import type {
  StatusConfig,
  StatusDefinition,
  StatusGroups,
} from '@artco-group/artco-ticketing-sync/types';
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  type Ticket,
  type User,
  type Filters,
} from '@/types';
import {
  StatusIcon,
  PriorityIcon,
  type IconVariant,
} from '@/shared/components/ui/BadgeIcons';
import { Icon } from '@/shared/components/ui/Icon';

/**
 * Type for assignedTo field (always populated object from API)
 */
export type AssignedToValue =
  | { id?: string | null; email?: string | null; name?: string | null }
  | null
  | undefined;

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

      if (filters.project && filters.project !== 'All') {
        const projectId = ticket.project?.id;
        if (projectId !== filters.project) {
          return false;
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
  [TicketStatus.BACKLOG]: {
    label: 'Backlog',
    getIcon: () => <StatusIcon fillPercent={0} variant="grey" dotted />,
  },
  [TicketStatus.IN_DESIGN]: {
    label: 'In Design',
    getIcon: () => <StatusIcon fillPercent={15} variant="blue" />,
  },
  [TicketStatus.IN_PROGRESS]: {
    label: 'In Progress',
    getIcon: () => <StatusIcon fillPercent={35} variant="yellow" />,
  },
  [TicketStatus.TESTING]: {
    label: 'Testing',
    getIcon: () => <StatusIcon fillPercent={55} variant="orange" />,
  },
  [TicketStatus.IN_REVIEW]: {
    label: 'In Review',
    getIcon: () => <StatusIcon fillPercent={75} variant="purple" />,
  },
  [TicketStatus.RESOLVED]: {
    label: 'Resolved',
    getIcon: () => <StatusIcon fillPercent={100} variant="green" />,
  },
  [TicketStatus.CANCELLED]: {
    label: 'Cancelled',
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

// ============================================================================
// Dynamic Status Helpers (for project-based workflow configurations)
// ============================================================================

/**
 * Map status color string to IconVariant
 */
export function getIconVariant(color: string): IconVariant {
  const colorMap: Record<string, IconVariant> = {
    grey: 'grey',
    gray: 'grey',
    blue: 'blue',
    yellow: 'yellow',
    orange: 'orange',
    purple: 'purple',
    green: 'green',
    red: 'red',
    teal: 'teal',
    pink: 'pink',
    violet: 'violet',
  };
  return colorMap[color.toLowerCase()] || 'grey';
}

/**
 * Generate status icon from a StatusDefinition
 */
export function getStatusIconFromDefinition(
  status: StatusDefinition
): ReactNode {
  const variant = getIconVariant(status.color);
  return (
    <StatusIcon
      fillPercent={status.icon.fillPercent}
      variant={variant}
      dotted={status.icon.dotted}
    />
  );
}

/**
 * Find a status definition by ID, checking custom config first then defaults
 */
function findStatusDefinition(
  statusId: string,
  statusConfig?: StatusConfig | null
): StatusDefinition | undefined {
  // Try custom config first
  if (statusConfig?.statuses) {
    const status = statusConfig.statuses.find((s) => s.id === statusId);
    if (status) return status;
  }
  // Fall back to default statuses
  return DEFAULT_STATUSES.find((s) => s.id === statusId);
}

/**
 * Get dynamic status icon - uses workflow if available, falls back to defaults
 */
export function getDynamicStatusIcon(
  statusId: string,
  statusConfig?: StatusConfig | null
): ReactNode {
  const status = findStatusDefinition(statusId, statusConfig);
  if (status) {
    return getStatusIconFromDefinition(status);
  }
  // Last resort: try enum-based icon
  return getStatusIcon(statusId as TicketStatus);
}

// ============================================================================
// Status Group Helpers (for tab-based filtering with workflow configurations)
// ============================================================================

/**
 * Get the status groups for a ticket based on its project's workflow config
 * Falls back to DEFAULT_STATUS_GROUPS if no config is available
 */
export function getStatusGroups(ticket: Ticket): StatusGroups {
  return ticket.project?.statusConfig?.groups ?? DEFAULT_STATUS_GROUPS;
}

/**
 * Check if a ticket's status is in the "backlog" group
 */
export function isBacklogStatus(ticket: Ticket): boolean {
  const groups = getStatusGroups(ticket);
  return groups.backlog.includes(ticket.status);
}

/**
 * Check if a ticket's status is in the "active" group
 */
export function isActiveStatus(ticket: Ticket): boolean {
  const groups = getStatusGroups(ticket);
  return groups.active.includes(ticket.status);
}

/**
 * Check if a ticket's status is in the "completed" group
 */
export function isCompletedStatus(ticket: Ticket): boolean {
  const groups = getStatusGroups(ticket);
  return groups.completed.includes(ticket.status);
}

/**
 * Check if a ticket's status is in the "cancelled" group
 */
export function isCancelledStatus(ticket: Ticket): boolean {
  const groups = getStatusGroups(ticket);
  return groups.cancelled.includes(ticket.status);
}

/**
 * Filter tickets by tab using workflow-aware status groups
 */
export function filterTicketsByTab(tickets: Ticket[], tab: string): Ticket[] {
  switch (tab) {
    case 'all':
      return tickets;
    case 'backlog':
      return tickets.filter(isBacklogStatus);
    case 'active':
      return tickets.filter(isActiveStatus);
    case 'resolved':
      return tickets.filter(isCompletedStatus);
    default:
      return tickets.filter(isActiveStatus);
  }
}

/**
 * Get unique status options from a list of tickets based on their workflow configs
 * Returns a deduplicated list of status definitions across all projects
 * Includes both custom workflow statuses AND default statuses for mixed scenarios
 */
export function getUniqueStatusOptions(
  tickets: Ticket[]
): Array<{ id: string; name: string; color: string; sortOrder: number }> {
  const statusMap = new Map<
    string,
    { id: string; name: string; color: string; sortOrder: number }
  >();
  let hasTicketsWithoutConfig = false;

  for (const ticket of tickets) {
    const statusConfig = ticket.project?.statusConfig;
    if (statusConfig?.statuses) {
      // Add statuses from custom workflow config
      for (const status of statusConfig.statuses) {
        if (!statusMap.has(status.id)) {
          statusMap.set(status.id, {
            id: status.id,
            name: status.name,
            color: status.color,
            sortOrder: status.sortOrder,
          });
        }
      }
    } else {
      // Track that we have tickets using default statuses
      hasTicketsWithoutConfig = true;
    }
  }

  // If some tickets use default statuses, add them to the options
  if (hasTicketsWithoutConfig) {
    for (const status of DEFAULT_STATUSES) {
      if (!statusMap.has(status.id)) {
        statusMap.set(status.id, {
          id: status.id,
          name: status.name,
          color: status.color,
          sortOrder: status.sortOrder,
        });
      }
    }
  }

  // If no statuses found at all (no tickets), return empty for caller to handle
  if (statusMap.size === 0) {
    return [];
  }

  return Array.from(statusMap.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}
