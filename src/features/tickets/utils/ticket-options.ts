import {
  TicketCategory,
  TicketCategoryDisplay,
  TicketStatus,
  TicketPriority,
  TicketPriorityDisplay,
} from '@artco-group/artco-ticketing-sync';
import {
  categoryBadgeConfig,
  statusBadgeConfig,
  priorityBadgeConfig,
} from '@/shared/utils/ticket-helpers';

/**
 * Status options for dropdowns (with badge labels)
 */
export const STATUS_OPTIONS = Object.values(TicketStatus).map((status) => ({
  label: statusBadgeConfig[status]?.label || status,
  value: status,
}));

/**
 * Priority options for dropdowns (with badge labels)
 */
export const PRIORITY_OPTIONS = Object.values(TicketPriority).map(
  (priority) => ({
    label: priorityBadgeConfig[priority]?.label || priority,
    value: priority,
  })
);

/**
 * Category options for dropdowns (with badge labels)
 */
export const CATEGORY_OPTIONS = Object.values(TicketCategory).map(
  (category) => ({
    label: categoryBadgeConfig[category]?.label || category,
    value: category,
  })
);

/**
 * Priority options for forms (using display names)
 */
export const PRIORITY_FORM_OPTIONS = [
  {
    label: TicketPriorityDisplay[TicketPriority.LOW],
    value: TicketPriority.LOW,
  },
  {
    label: TicketPriorityDisplay[TicketPriority.MEDIUM],
    value: TicketPriority.MEDIUM,
  },
  {
    label: TicketPriorityDisplay[TicketPriority.HIGH],
    value: TicketPriority.HIGH,
  },
  {
    label: TicketPriorityDisplay[TicketPriority.CRITICAL],
    value: TicketPriority.CRITICAL,
  },
];

/**
 * Category options for forms (using display names)
 */
export const CATEGORY_FORM_OPTIONS = [
  {
    label: TicketCategoryDisplay[TicketCategory.BUG],
    value: TicketCategory.BUG,
  },
  {
    label: TicketCategoryDisplay[TicketCategory.FEATURE_REQUEST],
    value: TicketCategory.FEATURE_REQUEST,
  },
  {
    label: TicketCategoryDisplay[TicketCategory.QUESTION],
    value: TicketCategory.QUESTION,
  },
  {
    label: TicketCategoryDisplay[TicketCategory.OTHER],
    value: TicketCategory.OTHER,
  },
];

/**
 * Tab configuration for ticket list page
 */
export const TICKET_TABS_CONFIG = [
  { id: 'active', labelKey: 'tabs.active', icon: 'tasks' },
  { id: 'backlog', labelKey: 'tabs.backlog', icon: 'backlog' },
  { id: 'resolved', labelKey: 'tabs.resolved', icon: 'check' },
  { id: 'all', labelKey: 'tabs.all', icon: 'all' },
] as const;

/**
 * Group by options configuration for ticket list
 */
export const GROUP_BY_OPTIONS_CONFIG = [
  { value: 'status', labelKey: 'groupBy.status' },
  { value: 'priority', labelKey: 'groupBy.priority' },
  { value: 'assignee', labelKey: 'groupBy.assignee' },
  { value: 'project', labelKey: 'groupBy.project' },
  { value: 'dueDate', labelKey: 'groupBy.dueDate' },
] as const;
