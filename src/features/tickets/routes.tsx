import { lazy } from 'react';
import { PAGE_ROUTES, ROUTE_PATTERNS } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load ticket pages
const TicketListPage = lazy(() => import('./pages/TicketListPage'));
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage'));

/**
 * Ticket feature routes
 * Includes ticket list and detail view
 */
export const ticketRoutes = [
  createPrivateRoute('ticket-list', PAGE_ROUTES.TICKETS.LIST, TicketListPage),
  createPrivateRoute(
    'ticket-detail',
    ROUTE_PATTERNS.TICKET_DETAIL,
    TicketDetailPage
  ),
];
