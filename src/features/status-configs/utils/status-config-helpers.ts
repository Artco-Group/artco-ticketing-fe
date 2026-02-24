import type {
  StatusGroups,
  StatusColor,
  StatusGroupType,
  StatusConfig,
} from '@artco-group/artco-ticketing-sync';
import {
  STATUS_COLORS,
  STATUS_GROUP_TYPES,
  DEFAULT_STATUS_CONFIG,
  StatusGroupTranslationKeys,
  StatusColorToVariant,
} from '@artco-group/artco-ticketing-sync';

export type { StatusGroupType };

export const COLOR_OPTIONS = STATUS_COLORS.map((color) => ({
  value: color,
  label: color.charAt(0).toUpperCase() + color.slice(1),
}));

/**
 * Group validation requirements for the editor
 */
export const GROUP_REQUIREMENTS = [
  { key: 'hasBacklog', labelKey: 'workflows.editor.groupRequirementBacklog' },
  { key: 'hasActive', labelKey: 'workflows.editor.groupRequirementActive' },
  {
    key: 'hasCompleted',
    labelKey: 'workflows.editor.groupRequirementCompleted',
  },
  { key: 'hasInitial', labelKey: 'workflows.editor.groupRequirementInitial' },
] as const;

/**
 * Get translated group select options
 */
export function getGroupSelectOptions(translate: (key: string) => string) {
  return STATUS_GROUP_TYPES.map((group: StatusGroupType) => ({
    value: group,
    label: translate(StatusGroupTranslationKeys[group]),
  }));
}

export function getGroupForStatus(
  statusId: string,
  groups: StatusGroups
): StatusGroupType {
  if (groups.backlog.includes(statusId)) return 'backlog';
  if (groups.active.includes(statusId)) return 'active';
  if (groups.completed.includes(statusId)) return 'completed';
  if (groups.cancelled.includes(statusId)) return 'cancelled';
  return 'backlog';
}

export function getFillPercentForGroup(
  group: StatusGroupType,
  index: number
): number {
  switch (group) {
    case 'backlog':
      return 0;
    case 'active':
      return Math.min(15 + index * 20, 75);
    case 'completed':
    case 'cancelled':
      return 100;
    default:
      return 0;
  }
}

export function getStatusVariant(color: StatusColor) {
  return StatusColorToVariant[color] || 'grey';
}

/**
 * Get statuses for a specific group, sorted by sortOrder
 */
export function getStatusesForGroup<
  T extends { id: string; sortOrder: number },
>(statuses: T[], groupStatusIds: string[]): T[] {
  return statuses
    .filter((s) => groupStatusIds.includes(s.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Get effective status config for a project
 * Returns the project's config or the default if none assigned
 */
export function getEffectiveStatusConfig(
  projectStatusConfig: StatusConfig | undefined | null
): StatusConfig {
  if (projectStatusConfig) {
    return projectStatusConfig;
  }
  return {
    id: 'default',
    name: DEFAULT_STATUS_CONFIG.name,
    description: DEFAULT_STATUS_CONFIG.description,
    isDefault: true,
    statuses: [...DEFAULT_STATUS_CONFIG.statuses],
    groups: { ...DEFAULT_STATUS_CONFIG.groups },
  };
}
