import type { ReactNode } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { pageConfigs } from '../config/page-configs';

interface LayoutWrapperProps {
  pageKey: string;
  children: ReactNode;
}

/**
 * Wrapper component for pages with layout
 * Connects page components to the main layout with appropriate configuration
 */
export function LayoutWrapper({ pageKey, children }: LayoutWrapperProps) {
  const pageConfig = pageConfigs[pageKey];

  return <MainLayout pageConfig={pageConfig}>{children}</MainLayout>;
}
