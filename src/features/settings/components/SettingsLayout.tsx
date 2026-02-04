import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { SettingsSidebar } from './SettingsSidebar';
import { SettingsSidebarContext } from './SettingsSidebarContext';
import { SidebarProvider } from '@/shared/components/layout/SidebarProvider';
import { Icon } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants';
import { useEffect } from 'react';
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
}: {
  children: ReactNode;
  activeSection: string;
  showMainSidebar: boolean;
  collapsed: boolean;
  groups: SettingsSideBarGroup[];
  onBackToTop: () => void;
  onNavigate?: (id: string) => void;
}) {
  const sidebarWidth = showMainSidebar ? '18rem' : collapsed ? '5rem' : '18rem';

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      {showMainSidebar && <Sidebar hideActiveIndicator={true} />}
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
              to={PAGE_ROUTES.SETTINGS}
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
  const [showMainSidebar, setShowMainSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleBackToTop = () => {
    setShowMainSidebar(true);
  };

  const handleNavigate = (id: string) => {
    navigate(`/settings/${id}`);
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
    <SidebarProvider>
      <SettingsSidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <SettingsLayoutContent
          activeSection={activeSection}
          showMainSidebar={showMainSidebar}
          collapsed={collapsed}
          groups={groups}
          onBackToTop={handleBackToTop}
          onNavigate={handleNavigate}
        >
          {children}
        </SettingsLayoutContent>
      </SettingsSidebarContext.Provider>
    </SidebarProvider>
  );
}
