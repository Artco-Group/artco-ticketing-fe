import { lazy } from 'react';
import { PAGE_ROUTES, ROUTE_PATTERNS } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load ticket pages
const TicketListPage = lazy(() => import('./pages/TicketListPage'));
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage'));
const TicketCreatePage = lazy(() => import('./pages/TicketCreatePage'));

/**
 * Ticket feature routes
 * Includes ticket list, detail view and create ticket form
 */
export const ticketRoutes = [
  // Ticket list route
  createPrivateRoute(
    'ticket-list',
    PAGE_ROUTES.TICKETS.LIST,
    'tickets',
    TicketListPage
  ),
  // Create ticket route (must come before detail to avoid matching :id)
  createPrivateRoute(
    'ticket-create',
    PAGE_ROUTES.TICKETS.CREATE,
    'tickets',
    TicketCreatePage
  ),
  // Ticket detail route
  createPrivateRoute(
    'ticket-detail',
    ROUTE_PATTERNS.TICKET_DETAIL,
    'tickets',
    TicketDetailPage
  ),
];
