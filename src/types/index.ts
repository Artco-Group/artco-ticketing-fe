import type { ReactNode } from 'react';

export interface Filters {
  status: string;
  priority: string;
  sortBy: string;
  client?: string;
  assignee?: string;
}

export interface MetaItem {
  label: string;
  value: ReactNode;
}
