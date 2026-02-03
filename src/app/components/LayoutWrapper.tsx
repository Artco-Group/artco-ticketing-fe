import type { ReactNode } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { pageConfigs } from '../config/page-configs';
import type { BreadcrumbItem } from '@/shared/components/composite/Breadcrumbs/Breadcrumbs';

interface LayoutWrapperProps {
  pageKey: string;
  children: ReactNode;
  /** Optional count to display as a badge next to the title */
  count?: number;
}

/**
 * Wrapper component for pages with layout
 * Connects page components to the main layout with appropriate configuration
 */
export function LayoutWrapper({
  pageKey,
  children,
  count,
}: LayoutWrapperProps) {
  const pageConfig = pageConfigs[pageKey];

  // Convert pageConfig breadcrumbs to BreadcrumbItem format (only items with href)
  const breadcrumbs: BreadcrumbItem[] | undefined = pageConfig?.breadcrumbs
    ?.filter((b) => b.href)
    .map((b) => ({
      label: b.label,
      href: b.href!,
    }));

  return (
    <MainLayout
      title={pageConfig?.title}
      count={count}
      breadcrumbs={
        breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : undefined
      }
    >
      {children}
    </MainLayout>
  );
}
