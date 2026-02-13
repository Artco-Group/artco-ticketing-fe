import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/context';
import { Breadcrumbs } from '@/shared/components/composite';
import type { BreadcrumbItem } from '@/shared/components/composite/Breadcrumbs/Breadcrumbs';
import { UserMenu } from '@/shared/components/composite/UserMenu';
import { NotificationBell } from '@/shared/components/composite/NotificationBell';
import type { NotificationItem } from '@/shared/components/composite/NotificationBell';

export interface PageHeaderProps {
  title?: string;
  count?: number;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  count,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div
      className={cn(
        'border-border-default flex h-16 shrink-0 items-center justify-between border-b px-4',
        className
      )}
    >
      <div className="flex flex-col justify-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className={title ? 'mb-0.5' : ''} />
        )}
        {(title || (count !== undefined && count > 0)) && (
          <div className="flex items-center gap-3">
            {title && (
              <h1 className="text-foreground text-xl font-semibold">{title}</h1>
            )}
            {count !== undefined && count > 0 && (
              <span className="bg-background-light-secondary text-text-tertiary rounded-lg px-3 py-1 text-base font-medium">
                {count}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="ml-4 flex items-center gap-2 md:ml-6">
        {actions}
        <UserMenu
          user={{
            name: user?.name ?? '',
            email: user?.email,
            avatarUrl: user?.profilePic,
          }}
          onLogout={logout}
        />
        <NotificationBell
          count={notifications.filter((n) => !n.isRead).length}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}
