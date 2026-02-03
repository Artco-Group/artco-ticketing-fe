import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarProvider';
import { useSidebar } from './useSidebar';
import { PageHeader, PageHeaderProvider } from '@/shared/components/patterns';
import type { BreadcrumbItem } from '@/shared/components/composite/Breadcrumbs/Breadcrumbs';

interface MainLayoutProps {
  children: ReactNode;
  /** Page title displayed in the header */
  title?: string;
  /** Optional count to display as a badge next to the title */
  count?: number;
  /** Optional breadcrumbs for nested page navigation */
  breadcrumbs?: BreadcrumbItem[];
}

function MainLayoutContent({
  children,
  title,
  count,
  breadcrumbs,
}: MainLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      <Sidebar />
      <div
        className="transition-[padding] duration-300"
        style={{ paddingLeft: collapsed ? '5rem' : '18rem' }}
      >
        <PageHeader
          title={title ?? ''}
          count={count}
          breadcrumbs={breadcrumbs}
        />
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

export function MainLayout({
  children,
  title,
  count,
  breadcrumbs,
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <PageHeaderProvider>
        <MainLayoutContent
          title={title}
          count={count}
          breadcrumbs={breadcrumbs}
        >
          {children}
        </MainLayoutContent>
      </PageHeaderProvider>
    </SidebarProvider>
  );
}
