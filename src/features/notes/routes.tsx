import { lazy } from 'react';
import { createPrivateRoute } from '@/shared/utils/route-helpers';
import { PAGE_ROUTES } from '@/shared/constants';

const NotesPage = lazy(() => import('./pages'));

export const notesRoutes = [
  createPrivateRoute('notes', PAGE_ROUTES.NOTES.ROOT, 'notes', NotesPage),
];
