import type { ReactNode } from 'react';

export type {
  Ticket,
  AssignedTo,
  User,
  Comment,
  Project,
  ProjectProgress,
} from '@artco-group/artco-ticketing-sync/types';

import type { User, Project } from '@artco-group/artco-ticketing-sync/types';

export interface ProjectWithProgress extends Project {
  progress?: {
    totalTickets: number;
    completedTickets: number;
    percentage: number;
  };
}

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
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface MetaItem {
  label: string;
  value: ReactNode;
}

/**
 * @deprecated Backend now returns data directly. Use the data type directly.
 * This type alias is kept for backwards compatibility during migration.
 */
export type ApiResponse<T> = T;

export * from './branded';
