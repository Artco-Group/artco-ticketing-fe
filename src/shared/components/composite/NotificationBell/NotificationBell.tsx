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
} from '@/shared/components/ui';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  createdAt?: string | Date;
  isRead?: boolean;
}

export interface NotificationBellProps {
  /** Total number of unread notifications */
  count: number;
  /** All notifications to display in the dropdown */
  notifications: NotificationItem[];
  /** Called when a single notification is marked as read */
  onMarkRead: (id: string) => void;
  /** Called when "Mark all as read" is clicked */
  onMarkAllRead: () => void;
  /** Called when "Clear all" is clicked; clears the list and shows empty state */
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
        className="w-[380px] max-w-[380px]"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-sidebar-foreground text-base font-medium">
            Notifications
          </span>
          {hasNotifications && (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={onMarkAllRead}
                aria-label="Mark all as read"
                className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full"
              >
                <Icon name="double-check" size="md" />
              </button>
              {onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  aria-label="Clear all notifications"
                  className="text-muted-foreground hover:text-foreground flex h-5 w-5 items-center justify-center rounded-full"
                >
                  <Icon name="close" size="sm" />
                </button>
              )}
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasNotifications && (
          <div className="flex flex-col items-center px-4 py-4 text-center">
            <img
              src="/src/assets/empty-states/no-comments.svg"
              alt=""
              className="mb-3 h-20 w-20"
              aria-hidden="true"
            />
            <p className="text-foreground mb-1 text-sm font-medium">
              You don&apos;t have any notifications
            </p>
            <p className="text-muted-foreground mb-4 text-xs">
              We&apos;ll keep you informed about key updates and any mentions of
              you on Trackly.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Icon name="settings" size="sm" />
              Notification Settings
            </Button>
          </div>
        )}

        {hasNotifications && (
          <>
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'border-border-default focus:bg-accent flex items-start gap-3 border-b px-3 py-3 text-sm last:border-b-0',
                    !notification.isRead && 'bg-background-light-secondary'
                  )}
                  onClick={() => onMarkRead(notification.id)}
                >
                  {/* Placeholder for future company logo */}
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
            <div className="border-border-default border-t py-3 text-center">
              <button
                type="button"
                className="text-foreground hover:text-foreground/80 text-sm font-medium transition-colors"
              >
                See more
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
