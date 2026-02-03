import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar';
import { SettingsSidebarProvider } from './SettingsSidebarProvider';
import { useSettingsSidebar } from './useSettingsSidebar';
import { Icon } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants';

interface SettingsLayoutProps {
  children: ReactNode;
  activeSection: string;
}

function SettingsLayoutContent({
  children,
  activeSection,
}: SettingsLayoutProps) {
  const { collapsed } = useSettingsSidebar();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <SettingsSidebar />
      <div
        className="transition-[padding] duration-300"
        style={{ paddingLeft: collapsed ? '5rem' : '18rem' }}
      >
        <main className="p-8">
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
}: SettingsLayoutProps) {
  return (
    <SettingsSidebarProvider>
      <SettingsLayoutContent activeSection={activeSection}>
        {children}
      </SettingsLayoutContent>
    </SettingsSidebarProvider>
  );
}
