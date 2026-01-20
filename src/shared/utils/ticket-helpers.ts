import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TicketPriorityDisplay,
  getStatusBadgeClasses,
  getCategoryBadgeClasses,
} from '@artco-group/artco-ticketing-sync';

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
