import { useState, useEffect, type ReactNode } from 'react';
import { SettingsSidebarContext } from './SettingsSidebarContext';

interface SettingsSidebarProviderProps {
  children: ReactNode;
}

export function SettingsSidebarProvider({
  children,
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
      {children}
    </SettingsSidebarContext.Provider>
  );
}
