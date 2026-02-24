import { useMemo, type ReactNode } from 'react';

export interface GroupConfig<T> {
  key: string;
  getGroupKey: (item: T) => string;
  getLabel?: (key: string) => string;
  getIcon?: (key: string) => ReactNode;
  sortOrder?: Record<string, number>;
  sortDirection?: 'asc' | 'desc';
}

export interface DataGroup<T> {
  key: string;
  label: string;
  icon: ReactNode;
  items: T[];
}

interface GroupWithSortIndex<T> extends DataGroup<T> {
  _sortIndex: number;
}

export function useGroupedData<T>(
  data: T[],
  groupBy: string | null,
  configs: GroupConfig<T>[]
): DataGroup<T>[] {
  return useMemo(() => {
    if (!groupBy || !data.length) return [];

    const config = configs.find((c) => c.key === groupBy);
    if (!config) return [];

    const { sortOrder, sortDirection, getLabel, getIcon } = config;
    const groups = new Map<string, T[]>();

    for (const item of data) {
      const key = config.getGroupKey(item);
      const existing = groups.get(key);
      if (existing) {
        existing.push(item);
      } else {
        groups.set(key, [item]);
      }
    }

    const result: GroupWithSortIndex<T>[] = Array.from(
      groups,
      ([key, items]) => ({
        key,
        label: getLabel?.(key) ?? key,
        icon: getIcon?.(key) ?? null,
        items,
        _sortIndex: sortOrder?.[key] ?? 99,
      })
    );

    if (sortOrder) {
      const multiplier = sortDirection === 'desc' ? -1 : 1;
      result.sort((a, b) => (a._sortIndex - b._sortIndex) * multiplier);
    } else {
      result.sort((a, b) => a.label.localeCompare(b.label));
    }

    return result;
  }, [data, groupBy, configs]);
}
