import type { ReactNode } from 'react';

export type {
  Ticket,
  AssignedTo,
  User,
  Comment,
  Project,
  ProjectProgress,
  ProjectWithProgress,
} from '@artco-group/artco-ticketing-sync/types';

import type { User } from '@artco-group/artco-ticketing-sync/types';

export interface UserWithProjects extends User {
  projects: { id: string; name: string }[];
}

export interface UserWithStats extends UserWithProjects {
  assignedTicketsCount: number;
}

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
  project?: string;
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
