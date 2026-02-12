import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  EmptyState,
} from '@/shared/components/ui';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  createdAt?: string | Date;
  isRead?: boolean;
}

export interface NotificationBellProps {
  count: number;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll?: () => void;
}

export function NotificationBell({
  count,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
}: NotificationBellProps) {
  const hasNotifications = notifications.length > 0;

  const unreadCount = useMemo(() => Math.max(0, count ?? 0), [count]);

  const badgeLabel =
    unreadCount > 99 ? '99+' : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:outline-none"
          aria-label="Notifications"
        >
          <Icon name="notification" size="xxl" />
          {badgeLabel && (
            <span className="bg-destructive text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[0.7rem] leading-none font-semibold">
              {badgeLabel}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[320px] max-w-[320px]"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-sidebar-foreground text-base font-medium">
            Notifications
          </span>
          {hasNotifications && (
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onMarkAllRead}
                aria-label="Mark all as read"
                className="h-6 w-6"
              >
                <Icon name="double-check" size="md" />
              </Button>
              {onClearAll && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClearAll}
                  aria-label="Clear all notifications"
                  className="h-5 w-5"
                >
                  <Icon name="close" size="sm" />
                </Button>
              )}
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasNotifications && (
          <div className="px-3 py-2">
            <EmptyState
              variant="no-notifications"
              title="No notifications"
              message="We'll notify you about updates and mentions."
              className="min-h-0"
            />
            <div className="mt-1 text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon="settings"
              >
                Notification Settings
              </Button>
            </div>
          </div>
        )}

        {hasNotifications && (
          <>
            <div className="max-h-[200px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'border-border-default focus:bg-accent flex items-start gap-2 border-b px-3 py-2 text-sm last:border-b-0',
                    !notification.isRead && 'bg-background-light-secondary'
                  )}
                  onClick={() => onMarkRead(notification.id)}
                >
                  <div
                    className="h-6 w-6 shrink-0 rounded-full bg-teal-500"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-x-1.5">
                      <p className="text-foreground text-sm font-medium">
                        {notification.title}
                      </p>
                      {notification.createdAt && (
                        <>
                          <span className="text-muted-foreground text-xs">
                            ·
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {typeof notification.createdAt === 'string'
                              ? notification.createdAt
                              : notification.createdAt instanceof Date
                                ? notification.createdAt.toLocaleDateString()
                                : null}
                          </span>
                        </>
                      )}
                    </div>
                    {notification.description && (
                      <p className="text-muted-foreground text-xs">
                        {notification.description}
                      </p>
                    )}
                  </div>
                  {!notification.isRead && (
                    <span
                      className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      aria-hidden
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
            <div className="border-border-default border-t py-2 text-center">
              <Button type="button" variant="link" size="sm">
                See more
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
