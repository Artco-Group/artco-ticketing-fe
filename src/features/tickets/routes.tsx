import { lazy } from 'react';
import { createPrivateRoute } from '@shared/utils/route-helpers';
import { ROUTES } from '@/app/routes/constants';
import { UserRole } from '@/types';

const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const EngLeadDashboard = lazy(() => import('./pages/EngLeadDashboard'));

export const ticketRoutes = [
  createPrivateRoute(ROUTES.DASHBOARD + '/client', ClientDashboard, {
    roles: [UserRole.Client],
  }),
  createPrivateRoute(ROUTES.DASHBOARD + '/developer', DeveloperDashboard, {
    roles: [UserRole.Developer],
  }),
  createPrivateRoute(ROUTES.DASHBOARD + '/lead', EngLeadDashboard, {
    roles: [UserRole.EngLead],
  }),
];
