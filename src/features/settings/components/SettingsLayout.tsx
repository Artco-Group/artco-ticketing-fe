import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { hasRole } from '@/shared/utils/role-helpers';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import type { SidebarItem } from '@/shared/components/layout/Sidebar';
import {
  ROUTE_MAP,
  NAVIGATION,
  FOOTER_SECTIONS,
  SIDEBAR_WIDTH,
} from '@/shared/components/layout/sidebar.config';
import { SettingsSidebar } from './SettingsSidebar';
import { SettingsSidebarContext } from './SettingsSidebarContext';

import { Icon } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants';
import type { SettingsSideBarGroup } from './SettingsSidebar';

interface SettingsLayoutProps {
  children: ReactNode;
  activeSection: string;
  groups: SettingsSideBarGroup[];
}

function SettingsLayoutContent({
  children,
  activeSection,
  showMainSidebar,
  collapsed,
  groups,
  onBackToTop,
  onNavigate,
  onMainSidebarNavigate,
  onMainSidebarToggle,
  mainSidebarItems,
}: {
  children: ReactNode;
  activeSection: string;
  showMainSidebar: boolean;
  collapsed: boolean;
  groups: SettingsSideBarGroup[];
  onBackToTop: () => void;
  onNavigate?: (id: string) => void;
  onMainSidebarNavigate: (id: string) => void;
  onMainSidebarToggle: () => void;
  mainSidebarItems: SidebarItem[];
}) {
  const sidebarWidth = showMainSidebar
    ? SIDEBAR_WIDTH.EXPANDED
    : collapsed
      ? SIDEBAR_WIDTH.COLLAPSED
      : SIDEBAR_WIDTH.EXPANDED;

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      {showMainSidebar && (
        <Sidebar
          items={mainSidebarItems}
          onNavigate={onMainSidebarNavigate}
          collapsed={false}
          onToggle={onMainSidebarToggle}
          footerSections={FOOTER_SECTIONS}
          searchPlaceholder="Search"
        />
      )}
      {!showMainSidebar && (
        <SettingsSidebar
          groups={groups}
          onBackToTop={onBackToTop}
          activeItem={activeSection}
          onNavigate={onNavigate}
        />
      )}
      <div
        className="transition-[padding] duration-300"
        style={{ paddingLeft: sidebarWidth, minWidth: 0 }}
      >
        <main className="p-8" style={{ width: '100%', minWidth: 0 }}>
          <nav className="mb-6 flex items-center gap-2 text-sm">
            <NavLink
              to={PAGE_ROUTES.SETTINGS.PROFILE}
              className="text-primary font-medium hover:underline"
            >
              Settings
            </NavLink>
            <Icon
              name="chevron-right"
              size="sm"
              className="text-muted-foreground"
            />
            <span className="text-foreground font-medium capitalize">
              {activeSection.replace(/-/g, ' ')}
            </span>
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
}

export function SettingsLayout({
  children,
  activeSection,
  groups,
}: SettingsLayoutProps) {
  const { user } = useAuth();
  const [showMainSidebar, setShowMainSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const mainSidebarItems = useMemo(
    () =>
      NAVIGATION.filter(
        (item) => !item.roles || hasRole(user, item.roles)
      ) as SidebarItem[],
    [user]
  );

  const handleBackToTop = () => {
    setShowMainSidebar(true);
  };

  const handleNavigate = (id: string) => {
    navigate(`/settings/${id}`);
  };

  const handleMainSidebarNavigate = (id: string) => {
    const path = ROUTE_MAP[id];
    if (path) {
      navigate(path);
    }
  };

  const handleMainSidebarToggle = () => {
    setShowMainSidebar(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SettingsSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <SettingsLayoutContent
        activeSection={activeSection}
        showMainSidebar={showMainSidebar}
        collapsed={collapsed}
        groups={groups}
        onBackToTop={handleBackToTop}
        onNavigate={handleNavigate}
        onMainSidebarNavigate={handleMainSidebarNavigate}
        onMainSidebarToggle={handleMainSidebarToggle}
        mainSidebarItems={mainSidebarItems}
      >
        {children}
      </SettingsLayoutContent>
    </SettingsSidebarContext.Provider>
  );
}
