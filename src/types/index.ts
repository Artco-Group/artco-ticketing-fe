import type { ReactNode } from 'react';

export type {
  Ticket,
  User,
  Comment,
  Project,
  ProjectProgress,
  ProjectWithUsers,
} from '@artco-group/artco-ticketing-sync/types';

export {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  UserRole,
  ProjectPriority,
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

/** API response wrapper type */
export interface ApiResponse<T> {
  status: string;
  data: T;
}

export * from './branded';
