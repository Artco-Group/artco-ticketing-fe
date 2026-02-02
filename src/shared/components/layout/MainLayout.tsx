import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SidebarProvider } from './SidebarProvider';
import { useSidebar } from './useSidebar';
import type { PageConfig } from '@/app/config/page-configs';

interface MainLayoutProps {
  children: ReactNode;
  pageConfig?: PageConfig;
}

function MainLayoutContent({ children, pageConfig }: MainLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      <Sidebar />
      <div
        className="transition-[padding] duration-300"
        style={{ paddingLeft: collapsed ? '5rem' : '18rem' }}
      >
        <Header pageConfig={pageConfig} />
        <main
          className="overflow-x-auto px-4 py-6 sm:px-6 lg:px-8"
          style={{ width: '100%', minWidth: 0 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function MainLayout({ children, pageConfig }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainLayoutContent pageConfig={pageConfig}>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}
