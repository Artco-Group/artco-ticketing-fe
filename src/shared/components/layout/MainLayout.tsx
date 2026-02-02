import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { PageConfig } from '@/app/config/page-configs';

interface MainLayoutProps {
  children: ReactNode;
  pageConfig?: PageConfig;
}

export function MainLayout({ children, pageConfig }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ minWidth: 0 }}>
      <Sidebar />
      <div
        className="pl-20 lg:pl-72"
        style={{ width: '100%', minWidth: 0, maxWidth: 'none' }}
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
