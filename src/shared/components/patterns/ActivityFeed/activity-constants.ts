import { ActivityAction } from '@artco-group/artco-ticketing-sync';
import type { IconName } from '@/shared/components/ui/Icon';

export type ActivityColorVariant =
  | 'green'
  | 'blue'
  | 'amber'
  | 'purple'
  | 'cyan'
  | 'rose'
  | 'gray';

export const actionIconMap: Partial<Record<ActivityAction, IconName>> = {
  [ActivityAction.TICKET_CREATED]: 'plus',
  [ActivityAction.TICKET_STATUS_CHANGED]: 'in-progress',
  [ActivityAction.TICKET_PRIORITY_CHANGED]: 'priority',
  [ActivityAction.TICKET_ASSIGNED]: 'user',
  [ActivityAction.TICKET_DELETED]: 'trash',
  [ActivityAction.PROJECT_CREATED]: 'tasks',
  [ActivityAction.PROJECT_MEMBER_ADDED]: 'user',
  [ActivityAction.PROJECT_DELETED]: 'trash',
  [ActivityAction.USER_CREATED]: 'user',
  [ActivityAction.COMMENT_ADDED]: 'mail',
};

export const actionColorMap: Partial<
  Record<ActivityAction, ActivityColorVariant>
> = {
  [ActivityAction.TICKET_CREATED]: 'green',
  [ActivityAction.TICKET_STATUS_CHANGED]: 'amber',
  [ActivityAction.TICKET_PRIORITY_CHANGED]: 'purple',
  [ActivityAction.TICKET_ASSIGNED]: 'blue',
  [ActivityAction.TICKET_DELETED]: 'rose',
  [ActivityAction.PROJECT_CREATED]: 'green',
  [ActivityAction.PROJECT_MEMBER_ADDED]: 'blue',
  [ActivityAction.PROJECT_DELETED]: 'rose',
  [ActivityAction.USER_CREATED]: 'cyan',
  [ActivityAction.COMMENT_ADDED]: 'gray',
};

export const iconColorMap: Record<ActivityColorVariant, string> = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  rose: 'bg-rose-100 text-rose-600',
  gray: 'bg-gray-100 text-gray-600',
};

export const priorityTranslationKeyMap: Record<string, string> = {
  Low: 'priority.low',
  Medium: 'priority.medium',
  High: 'priority.high',
  Critical: 'priority.critical',
  Urgent: 'priority.urgent',
};
