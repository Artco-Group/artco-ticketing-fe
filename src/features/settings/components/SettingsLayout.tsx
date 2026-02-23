import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { useResponsiveCollapse, useTranslatedNavigation } from '@/shared/hooks';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import {
  ROUTE_MAP,
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

export function SettingsLayout({
  children,
  activeSection,
  groups,
}: SettingsLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMainSidebar, setShowMainSidebar] = useState(false);
  const { collapsed, setCollapsed } = useResponsiveCollapse();
  const { items, footerSections } = useTranslatedNavigation(user);

  const handleBackToTop = () => setShowMainSidebar(true);
  const handleNavigate = (id: string) => navigate(`/settings/${id}`);
  const handleMainSidebarToggle = () => setShowMainSidebar(false);

  const handleMainSidebarNavigate = (id: string) => {
    const path = ROUTE_MAP[id];
    if (path) {
      navigate(path);
    }
  };

  const sidebarWidth = showMainSidebar
    ? SIDEBAR_WIDTH.EXPANDED
    : collapsed
      ? SIDEBAR_WIDTH.COLLAPSED
      : SIDEBAR_WIDTH.EXPANDED;

  return (
    <SettingsSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="h-screen w-full bg-gray-50">
        {showMainSidebar && (
          <Sidebar
            items={items}
            onNavigate={handleMainSidebarNavigate}
            collapsed={false}
            onToggle={handleMainSidebarToggle}
            footerSections={footerSections}
          />
        )}
        {!showMainSidebar && (
          <SettingsSidebar
            groups={groups}
            onBackToTop={handleBackToTop}
            activeItem={activeSection}
            onNavigate={handleNavigate}
          />
        )}
        <div
          className="flex h-full flex-col transition-[padding] duration-300"
          style={{ paddingLeft: sidebarWidth }}
        >
          <main className="flex-1 overflow-auto p-8">
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
    </SettingsSidebarContext.Provider>
  );
}
