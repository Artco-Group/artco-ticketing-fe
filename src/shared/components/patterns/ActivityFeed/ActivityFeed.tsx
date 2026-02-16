import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import {
  ActivityAction,
  type Activity,
} from '@artco-group/artco-ticketing-sync';
import { transformActivity } from './activity-utils';

export type ActivityColorVariant =
  | 'green'
  | 'blue'
  | 'amber'
  | 'purple'
  | 'cyan'
  | 'rose'
  | 'gray';

const actionIconMap: Partial<Record<ActivityAction, IconName>> = {
  [ActivityAction.TICKET_CREATED]: 'plus',
  [ActivityAction.TICKET_STATUS_CHANGED]: 'in-progress',
  [ActivityAction.TICKET_PRIORITY_CHANGED]: 'priority',
  [ActivityAction.TICKET_ASSIGNED]: 'user',
  [ActivityAction.PROJECT_CREATED]: 'tasks',
  [ActivityAction.PROJECT_MEMBER_ADDED]: 'user',
  [ActivityAction.USER_CREATED]: 'user',
  [ActivityAction.COMMENT_ADDED]: 'mail',
};

const actionColorMap: Partial<Record<ActivityAction, ActivityColorVariant>> = {
  [ActivityAction.TICKET_CREATED]: 'green',
  [ActivityAction.TICKET_STATUS_CHANGED]: 'amber',
  [ActivityAction.TICKET_PRIORITY_CHANGED]: 'purple',
  [ActivityAction.TICKET_ASSIGNED]: 'blue',
  [ActivityAction.PROJECT_CREATED]: 'green',
  [ActivityAction.PROJECT_MEMBER_ADDED]: 'blue',
  [ActivityAction.USER_CREATED]: 'cyan',
  [ActivityAction.COMMENT_ADDED]: 'gray',
};

const iconColorMap: Record<ActivityColorVariant, string> = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  rose: 'bg-rose-100 text-rose-600',
  gray: 'bg-gray-100 text-gray-600',
};

export interface ActivityItem {
  id: string;
  actorId: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  actionTemplate?: string;
  affectedUserId?: string;
  affectedUserName?: string;
  targetName?: string;
  targetLink?: string;
  targetSuffix?: string;
  timestamp: Date | string;
  activityAction?: ActivityAction;
  icon?: IconName;
  metadata?: Record<string, string>;
  colorVariant?: ActivityColorVariant;
}

export interface ActivityFeedProps {
  items?: ActivityItem[];
  activities?: Activity[];
  className?: string;
  emptyMessage?: string;
  maxItems?: number;
  showIcon?: boolean;
  currentUserId?: string;
  variant?: 'list' | 'timeline';
}

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const timestamp = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function ActivityItemRow({
  item,
  showIcon,
  isCurrentUser,
  currentUserId,
}: {
  item: ActivityItem;
  showIcon: boolean;
  isCurrentUser: boolean;
  currentUserId?: string;
}) {
  const icon =
    item.icon ??
    (item.activityAction ? actionIconMap[item.activityAction] : undefined);
  const colorVariant =
    item.colorVariant ??
    (item.activityAction ? actionColorMap[item.activityAction] : undefined);
  const displayName = isCurrentUser ? 'You' : item.user.name;

  // Check if affected user is current user
  const isAffectedUserCurrent =
    currentUserId && item.affectedUserId === currentUserId;
  const displayAction =
    item.actionTemplate && isAffectedUserCurrent
      ? item.actionTemplate.replace('{affectedUser}', 'you')
      : item.action;

  return (
    <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50">
      <div className="relative shrink-0">
        <Avatar
          src={item.user.avatar}
          fallback={item.user.name}
          size="md"
          tooltip={item.user.name}
        />
        {showIcon && icon && colorVariant && (
          <div
            className={cn(
              'absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white',
              iconColorMap[colorVariant]
            )}
          >
            <Icon name={icon} size="xs" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-gray-700">
          <span className="font-semibold text-gray-900">{displayName}</span>
          <span> {displayAction} </span>
          {item.targetName &&
            (item.targetLink ? (
              <NavLink
                to={item.targetLink}
                className="font-semibold text-gray-900 hover:text-blue-600 hover:underline"
              >
                {item.targetName}
              </NavLink>
            ) : (
              <span className="font-semibold text-gray-900">
                {item.targetName}
              </span>
            ))}
          {item.targetSuffix && (
            <span className="text-gray-500"> {item.targetSuffix}</span>
          )}
        </p>

        <p className="mt-1.5 text-xs text-gray-400">
          {formatRelativeTime(item.timestamp)}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  item,
  isCurrentUser,
  isLast,
  currentUserId,
}: {
  item: ActivityItem;
  isCurrentUser: boolean;
  isLast: boolean;
  currentUserId?: string;
}) {
  const icon =
    item.icon ??
    (item.activityAction ? actionIconMap[item.activityAction] : undefined);
  const colorVariant: ActivityColorVariant =
    item.colorVariant ??
    (item.activityAction ? actionColorMap[item.activityAction] : undefined) ??
    'gray';
  const displayName = isCurrentUser ? 'You' : item.user.name;

  // Check if affected user is current user
  const isAffectedUserCurrent =
    currentUserId && item.affectedUserId === currentUserId;
  const displayAction =
    item.actionTemplate && isAffectedUserCurrent
      ? item.actionTemplate.replace('{affectedUser}', 'you')
      : item.action;

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute top-10 left-[19px] h-full w-0.5 bg-gray-200" />
      )}

      {/* Avatar with icon badge */}
      <div className="relative shrink-0">
        <Avatar
          src={item.user.avatar}
          fallback={item.user.name}
          size="md"
          tooltip={item.user.name}
        />
        <div
          className={cn(
            'absolute -right-0.5 bottom-1 flex h-4 w-4 items-center justify-center rounded-full ring-[1.5px] ring-white',
            iconColorMap[colorVariant]
          )}
        >
          <Icon name={icon || 'clock'} className="h-2.5 w-2.5" />
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm leading-relaxed text-gray-700">
          <span className="font-semibold text-gray-900">{displayName}</span>
          <span> {displayAction} </span>
          {item.targetName &&
            (item.targetLink ? (
              <NavLink
                to={item.targetLink}
                className="font-semibold text-gray-900 hover:text-blue-600 hover:underline"
              >
                {item.targetName}
              </NavLink>
            ) : (
              <span className="font-semibold text-gray-900">
                {item.targetName}
              </span>
            ))}
          {item.targetSuffix && (
            <span className="text-gray-500"> {item.targetSuffix}</span>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {formatRelativeTime(item.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed({
  items,
  activities,
  className,
  emptyMessage = 'No activity yet',
  maxItems,
  showIcon = true,
  currentUserId,
  variant = 'list',
}: ActivityFeedProps) {
  const allItems = items ?? activities?.map(transformActivity) ?? [];
  const displayItems = maxItems ? allItems.slice(0, maxItems) : allItems;

  if (allItems.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Icon name="clock" size="lg" className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={cn('py-4', className)}>
        {displayItems.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isCurrentUser={currentUserId === item.actorId}
            isLast={index === displayItems.length - 1}
            currentUserId={currentUserId}
          />
        ))}

        {maxItems && allItems.length > maxItems && (
          <div className="ml-14 pt-2">
            <span className="text-sm text-gray-400">
              +{allItems.length - maxItems} more activities
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {displayItems.map((item) => (
        <ActivityItemRow
          key={item.id}
          item={item}
          showIcon={showIcon}
          isCurrentUser={currentUserId === item.actorId}
          currentUserId={currentUserId}
        />
      ))}

      {maxItems && allItems.length > maxItems && (
        <div className="pt-2 text-center">
          <span className="text-sm text-gray-400">
            +{allItems.length - maxItems} more activities
          </span>
        </div>
      )}
    </div>
  );
}
