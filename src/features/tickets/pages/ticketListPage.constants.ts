import type { Tab, GroupByOption } from '@/shared/components/patterns';

export const TICKET_TABS: Tab[] = [
  { id: 'active', label: 'Active', icon: 'tasks' },
  { id: 'backlog', label: 'Backlog', icon: 'backlog' },
  { id: 'all', label: 'All', icon: 'all' },
];

export const GROUP_BY_OPTIONS: GroupByOption[] = [
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'assignee', label: 'Assignee' },
  { value: 'dueDate', label: 'Due Date' },
];

export const SORT_OPTIONS = [
  'Title',
  'Ticket ID',
  'Client',
  'Category',
  'Priority',
  'Status',
] as const;

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'] as const;

export const STATUS_OPTIONS = [
  'New',
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
] as const;
