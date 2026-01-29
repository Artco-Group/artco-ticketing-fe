import { useState } from 'react';
import { useAuth } from '@/features/auth/context';
import { UserRoleDisplay } from '@artco-group/artco-ticketing-sync';
import { UserRole } from '@/types';
import type { PageConfig } from '@/app/config/page-configs';
import {
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from '@/shared/components/ui';
import { NotificationBell } from '@/shared/components';
import type { NotificationItem } from '@/shared/components/composite/NotificationBell/NotificationBell';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New ticket assigned',
    description: 'TICKET-123 needs your review',
    createdAt: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Comment added',
    description: 'John replied to TICKET-456',
    createdAt: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'Status changed',
    description: 'TICKET-789 marked as resolved',
    createdAt: '45 min ago',
    isRead: false,
  },
  {
    id: '4',
    title: 'Priority updated',
    description: 'TICKET-101 is now high priority',
    createdAt: '1 day ago',
    isRead: true,
  },
];

interface HeaderProps {
  pageConfig?: PageConfig;
}

export function Header({ pageConfig }: HeaderProps) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

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

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

        <div className="ml-4 flex items-center gap-2 md:ml-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="gap-xs flex flex-col">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-muted-xs">{user?.email}</p>
                  <p className="text-muted-xs">
                    {user?.role && UserRoleDisplay[user.role as UserRole]}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <Icon name="logout" size="md" className="mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
