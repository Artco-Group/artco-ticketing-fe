import { lazy } from 'react';
import { PAGE_ROUTES, ROUTE_PATTERNS } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load project pages
const ProjectListPage = lazy(() => import('./pages/ProjectListPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

/**
 * Project feature routes
 */
export const projectRoutes = [
  createPrivateRoute(
    'project-list',
    PAGE_ROUTES.PROJECTS.LIST,
    ProjectListPage
  ),
  createPrivateRoute(
    'project-detail',
    ROUTE_PATTERNS.PROJECT_DETAIL,
    ProjectDetailPage
  ),
];
