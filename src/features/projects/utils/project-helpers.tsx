import type { ReactNode } from 'react';
import {
  ProjectPriority,
  ProjectPriorityDisplay,
} from '@artco-group/artco-ticketing-sync';
import {
  PriorityIcon,
  type IconVariant,
} from '@/shared/components/ui/BadgeIcons';

export const PROJECT_PRIORITY_ORDER: Record<string, number> = {
  [ProjectPriority.CRITICAL]: 4,
  [ProjectPriority.HIGH]: 3,
  [ProjectPriority.MEDIUM]: 2,
  [ProjectPriority.LOW]: 1,
};

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
