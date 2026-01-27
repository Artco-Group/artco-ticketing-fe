import type { ReactNode } from 'react';

export type {
  Ticket,
  User,
  Comment,
} from '@artco-group/artco-ticketing-sync/types';

export {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  UserRole,
} from '@artco-group/artco-ticketing-sync/enums';

export interface Filters {
  status: string;
  priority: string;
  sortBy: string;
  client?: string;
  assignee?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface MetaItem {
  label: string;
  value: ReactNode;
}

export * from './branded';
