import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarProvider';
import { useSidebar } from './useSidebar';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayoutContent({ children }: MainLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      <Sidebar />
      <div
        className="transition-[padding] duration-300"
        style={{ paddingLeft: collapsed ? '5rem' : '18rem' }}
      >
        {children}
      </div>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}
