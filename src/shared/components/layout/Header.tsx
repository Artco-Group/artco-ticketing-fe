import { useState } from 'react';
import { useAuth } from '@/features/auth/context';
import type { PageConfig } from '@/app/config/page-configs';
import { NotificationBell, UserMenu } from '@/shared/components';
import type { NotificationItem } from '@/shared/components/composite/NotificationBell/NotificationBell';

interface HeaderProps {
  pageConfig?: PageConfig;
}

export function Header({ pageConfig }: HeaderProps) {
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
    <div className="bg-card sticky top-0 z-10 flex h-16 shrink-0 border-b shadow-sm">
      <div className="flex flex-1 items-center justify-between px-4">
        {/* Page title from config */}
        <div className="flex-start-gap-3">
          {pageConfig?.title && (
            <h1 className="text-foreground text-lg font-semibold">
              {pageConfig.title}
            </h1>
          )}
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <UserMenu
            user={{
              name: user?.name ?? '',
              email: user?.email,
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
    </div>
  );
}
