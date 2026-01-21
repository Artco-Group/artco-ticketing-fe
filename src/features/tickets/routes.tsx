import { lazy } from 'react';
import { createPrivateRoute } from '@shared/utils/route-helpers';
import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';
import { UserRole } from '@artco-group/artco-ticketing-sync/enums';

const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const EngLeadDashboard = lazy(() => import('./pages/EngLeadDashboard'));

export const ticketRoutes = [
  createPrivateRoute(PAGE_ROUTES.DASHBOARD.CLIENT, ClientDashboard, {
    roles: [UserRole.CLIENT],
  }),
  createPrivateRoute(PAGE_ROUTES.DASHBOARD.DEVELOPER, DeveloperDashboard, {
    roles: [UserRole.DEVELOPER],
  }),
  createPrivateRoute(PAGE_ROUTES.DASHBOARD.ENG_LEAD, EngLeadDashboard, {
    roles: [UserRole.ENG_LEAD],
  }),
];
