import { lazy } from 'react';
import { createPrivateRoute } from '@/shared/utils/route-helpers';
import { PAGE_ROUTES } from '@/shared/constants';

const InboxPage = lazy(() => import('./pages'));

export const inboxRoutes = [
  createPrivateRoute('inbox', PAGE_ROUTES.INBOX.ROOT, InboxPage),
];
