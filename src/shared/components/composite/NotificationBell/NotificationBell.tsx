import { useMemo } from 'react';

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
}

export function NotificationBell({
  count,
  notifications,
  onMarkRead,
  onMarkAllRead,
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
          size="icon"
          className="relative ml-2 rounded-full focus-visible:ring-0 focus-visible:outline-none"
          aria-label="Notifications"
        >
          <Icon name="notification" size="md" />
          {badgeLabel && (
            <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[0.7rem] leading-none font-semibold">
              {badgeLabel}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-w-sm" align="end" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasNotifications && (
          <div className="text-muted-foreground flex items-center justify-center px-3 py-6 text-sm">
            No notifications
          </div>
        )}

        {hasNotifications &&
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex items-start gap-2 py-2 text-sm"
              onClick={() => onMarkRead(notification.id)}
            >
              {!notification.isRead && (
                <span className="bg-primary mt-1 h-2 w-2 rounded-full" />
              )}
              <div className="flex-1 space-y-0.5">
                <p className="text-foreground text-sm font-medium">
                  {notification.title}
                </p>
                {notification.description && (
                  <p className="text-muted-foreground text-xs">
                    {notification.description}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
