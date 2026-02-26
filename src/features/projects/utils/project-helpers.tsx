/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import {
  ProjectPriority,
  ProjectPriorityDisplay,
  ProjectPriorityTranslationKeys,
  type Project,
} from '@artco-group/artco-ticketing-sync';
import {
  PriorityIcon,
  type IconVariant,
} from '@/shared/components/ui/BadgeIcons';

// ============================================================================
// Tab Types and Filtering
// ============================================================================

export type ProjectTab = 'active' | 'archived' | 'all';

export const PROJECT_TAB_CONFIG = [
  { id: 'active', icon: 'tasks', labelKey: 'listTabs.active' },
  { id: 'archived', icon: 'inbox', labelKey: 'listTabs.archived' },
  { id: 'all', icon: 'all', labelKey: 'listTabs.all' },
] as const;

/**
 * Filter projects by tab selection
 */
export function filterProjectsByTab<T extends Project>(
  projects: T[],
  tab: ProjectTab
): T[] {
  switch (tab) {
    case 'active':
      return projects.filter((p) => !p.isArchived);
    case 'archived':
      return projects.filter((p) => p.isArchived);
    case 'all':
      return projects;
    default:
      return projects.filter((p) => !p.isArchived);
  }
}

// ============================================================================
// Priority Helpers
// ============================================================================

interface PriorityBadgeConfig {
  label: string;
  filledBars: number;
  variant: IconVariant;
  getIcon: () => ReactNode;
}

/**
 * Priority badge configuration with variants and icons
 */
export const projectPriorityBadgeConfig: Record<
  ProjectPriority,
  PriorityBadgeConfig
> = {
  [ProjectPriority.LOW]: {
    label: ProjectPriorityDisplay[ProjectPriority.LOW],
    filledBars: 1,
    variant: 'green',
    getIcon: () => <PriorityIcon filledBars={1} variant="green" />,
  },
  [ProjectPriority.MEDIUM]: {
    label: ProjectPriorityDisplay[ProjectPriority.MEDIUM],
    filledBars: 2,
    variant: 'yellow',
    getIcon: () => <PriorityIcon filledBars={2} variant="yellow" />,
  },
  [ProjectPriority.HIGH]: {
    label: ProjectPriorityDisplay[ProjectPriority.HIGH],
    filledBars: 3,
    variant: 'orange',
    getIcon: () => <PriorityIcon filledBars={3} variant="orange" />,
  },
  [ProjectPriority.CRITICAL]: {
    label: ProjectPriorityDisplay[ProjectPriority.CRITICAL],
    filledBars: 4,
    variant: 'red',
    getIcon: () => <PriorityIcon filledBars={4} variant="red" />,
  },
};

export function getProjectPriorityIcon(
  priority: ProjectPriority | string
): ReactNode {
  const key = (priority as string).toLowerCase() as ProjectPriority;
  const config = projectPriorityBadgeConfig[key];
  return config?.getIcon?.() ?? null;
}

export function getProjectPriorityLabel(
  priority: ProjectPriority | string
): string {
  const key = (priority as string).toLowerCase() as ProjectPriority;
  const config = projectPriorityBadgeConfig[key];
  return config?.label ?? (priority as string);
}

// ============================================================================
// Filter & Sort Options
// ============================================================================

export const PROJECT_SORT_CONFIG = [
  { value: 'Name', labelKey: 'sort.name' },
  { value: 'Priority', labelKey: 'sort.priority' },
  { value: 'Due Date', labelKey: 'sort.dueDate' },
  { value: 'Progress', labelKey: 'sort.progress' },
  { value: 'Updated', labelKey: 'sort.updated' },
] as const;

export type ProjectSortKey = (typeof PROJECT_SORT_CONFIG)[number]['value'];

export const PROJECT_GROUP_BY_CONFIG = [
  { value: 'dueDate', labelKey: 'groupBy.dueDate' },
  { value: 'client', labelKey: 'groupBy.client' },
] as const;

export const getProjectPriorityOptions = (translate: (key: string) => string) =>
  Object.values(ProjectPriority).map((priority) => ({
    value: ProjectPriorityDisplay[priority],
    label: translate(ProjectPriorityTranslationKeys[priority]),
  }));
