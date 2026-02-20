import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Icon } from '@/shared/components/ui/Icon';
import { transformActivity } from './activity-utils';
import {
  useActivityTranslations,
  type ActivityTranslations,
} from './useActivityTranslations';
import {
  actionIconMap,
  actionColorMap,
  iconColorMap,
  type ActivityColorVariant,
} from './activity-constants';
import type { ActivityItem, ActivityFeedProps } from './types';

export type { ActivityItem, ActivityFeedProps, ActivityColorVariant };

interface ActivityContentProps {
  item: ActivityItem;
  isCurrentUser: boolean;
  currentUserId?: string;
  translations: ActivityTranslations;
}

function ActivityContent({
  item,
  isCurrentUser,
  currentUserId,
  translations,
}: ActivityContentProps) {
  const auxiliary = isCurrentUser
    ? translations.auxiliarySecondPerson
    : translations.auxiliaryThirdPerson;
  const displayName = isCurrentUser ? translations.youLabel : item.user.name;

  let displayAction = translations.getTranslatedAction(item, isCurrentUser);
  const isAffectedUserCurrent =
    currentUserId && item.affectedUserId === currentUserId;
  if (isAffectedUserCurrent && item.affectedUserName) {
    displayAction = displayAction.replace(
      item.affectedUserName,
      translations.youLowercase
    );
  }

  const displaySuffix = translations.getTranslatedSuffix(item);

  return (
    <>
      <p className="text-sm leading-relaxed text-gray-700">
        <span className="font-semibold text-gray-900">{displayName}</span>
        <span>
          {' '}
          {auxiliary ? `${auxiliary} ` : ''}
          {displayAction}{' '}
        </span>
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
        {displaySuffix && (
          <span className="text-gray-500"> {displaySuffix}</span>
        )}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {translations.formatRelativeTime(item.timestamp)}
      </p>
    </>
  );
}

function ActivityItemRow({
  item,
  showIcon,
  isCurrentUser,
  currentUserId,
  translations,
}: ActivityContentProps & { showIcon: boolean }) {
  const icon =
    item.icon ??
    (item.activityAction ? actionIconMap[item.activityAction] : undefined);
  const colorVariant =
    item.colorVariant ??
    (item.activityAction ? actionColorMap[item.activityAction] : undefined);

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
              'absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center rounded-full ring-2 ring-white',
              iconColorMap[colorVariant]
            )}
          >
            <Icon name={icon} size="xs" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <ActivityContent
          item={item}
          isCurrentUser={isCurrentUser}
          currentUserId={currentUserId}
          translations={translations}
        />
      </div>
    </div>
  );
}

function TimelineItem({
  item,
  isCurrentUser,
  isLast,
  currentUserId,
  translations,
}: ActivityContentProps & { isLast: boolean }) {
  const icon =
    item.icon ??
    (item.activityAction ? actionIconMap[item.activityAction] : undefined);
  const colorVariant: ActivityColorVariant =
    item.colorVariant ??
    (item.activityAction ? actionColorMap[item.activityAction] : undefined) ??
    'gray';

  return (
    <div className="relative flex gap-4 pb-6">
      {!isLast && (
        <div className="absolute top-10 left-[19px] h-full w-0.5 bg-gray-200" />
      )}
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
      <div className="min-w-0 flex-1 pt-1">
        <ActivityContent
          item={item}
          isCurrentUser={isCurrentUser}
          currentUserId={currentUserId}
          translations={translations}
        />
      </div>
    </div>
  );
}

function EmptyState({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
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
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function LoadMoreButton({
  variant,
  translations,
  onLoadMore,
  isLoading,
}: {
  variant: 'list' | 'timeline';
  translations: ActivityTranslations;
  onLoadMore: () => void;
  isLoading?: boolean;
}) {
  const className = variant === 'timeline' ? 'ml-14 pt-4' : 'pt-4 text-center';
  return (
    <div className={className}>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? translations.loadingLabel : translations.loadMoreLabel}
      </button>
    </div>
  );
}

export function ActivityFeed({
  items,
  activities,
  className,
  emptyMessage,
  maxItems,
  showIcon = true,
  currentUserId,
  variant = 'list',
  onLoadMore,
  isLoadingMore,
  hasMore = true,
}: ActivityFeedProps) {
  const translations = useActivityTranslations();

  const allItems = items ?? activities?.map(transformActivity) ?? [];
  const displayItems = maxItems ? allItems.slice(0, maxItems) : allItems;
  const showLoadMore = onLoadMore && hasMore;

  if (allItems.length === 0) {
    return (
      <EmptyState
        message={emptyMessage ?? translations.noActivityMessage}
        className={className}
      />
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
            isLast={index === displayItems.length - 1 && !showLoadMore}
            currentUserId={currentUserId}
            translations={translations}
          />
        ))}
        {showLoadMore && (
          <LoadMoreButton
            variant={variant}
            translations={translations}
            onLoadMore={onLoadMore}
            isLoading={isLoadingMore}
          />
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
          translations={translations}
        />
      ))}
      {showLoadMore && (
        <LoadMoreButton
          variant={variant}
          translations={translations}
          onLoadMore={onLoadMore}
          isLoading={isLoadingMore}
        />
      )}
    </div>
  );
}
