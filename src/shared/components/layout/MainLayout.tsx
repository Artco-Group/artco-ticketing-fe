import { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { hasRole } from '@/shared/utils/role-helpers';

import { Sidebar } from './Sidebar';
import type { SidebarItem } from './Sidebar';
import {
  ROUTE_MAP,
  NAVIGATION,
  FOOTER_SECTIONS,
  SIDEBAR_WIDTH,
} from './sidebar.config';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = useMemo(
    () =>
      NAVIGATION.filter(
        (item) => !item.roles || hasRole(user, item.roles)
      ) as SidebarItem[],
    [user]
  );

  const activeItem = useMemo(() => {
    for (const [id, path] of Object.entries(ROUTE_MAP)) {
      if (
        location.pathname === path ||
        location.pathname.startsWith(path + '/')
      ) {
        return id;
      }
    }
    return undefined;
  }, [location.pathname]);

  const handleNavigate = (id: string) => {
    const path = ROUTE_MAP[id];
    if (path) {
      navigate(path);
    }
  };

  const handleToggle = () => {
    if (window.innerWidth < 1024) return;
    setCollapsed(!collapsed);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      <Sidebar
        items={items}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        footerSections={FOOTER_SECTIONS}
        searchPlaceholder="Search"
        collapsed={collapsed}
        onToggle={handleToggle}
      />
      <div
        className="transition-[padding] duration-300"
        style={{
          paddingLeft: collapsed
            ? SIDEBAR_WIDTH.COLLAPSED
            : SIDEBAR_WIDTH.EXPANDED,
        }}
      >
        {children}
      </div>
    </div>
  );
}
