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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header pageConfig={pageConfig} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
