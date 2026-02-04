import { useState, useEffect, type ReactNode } from 'react';
import { SettingsSidebarContext } from './SettingsSidebarContext';
import { SettingsSidebar } from './SettingsSidebar';
import type { SettingsSideBarGroup } from './SettingsSidebar';

interface SettingsSidebarProviderProps {
  children: ReactNode;
  groups: SettingsSideBarGroup[];
  onBackToTop?: () => void;
  showMainSidebar?: boolean;
}

export function SettingsSidebarProvider({
  children,
  groups,
  onBackToTop,
  showMainSidebar = false,
}: SettingsSidebarProviderProps) {
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

  return (
    <SettingsSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {!showMainSidebar && (
        <SettingsSidebar groups={groups} onBackToTop={onBackToTop} />
      )}
      {children}
    </SettingsSidebarContext.Provider>
  );
}
