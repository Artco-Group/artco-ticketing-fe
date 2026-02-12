import { useMemo } from 'react';
import type { User, Filters } from '@/types';
import type {
  FilterGroup,
  FilterPanelValues,
} from '@/shared/components/patterns';
import { Icon } from '@/shared/components/ui';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from '../pages/ticketListPage.constants';

interface UseTicketFiltersProps {
  filters: Filters | undefined;
  users: User[];
  onFilterChange: ((filterType: string, value: string) => void) | undefined;
}

export function useTicketFilters({
  filters,
  users,
  onFilterChange,
}: UseTicketFiltersProps) {
  const filterPanelValue = useMemo<FilterPanelValues>(() => {
    const value: FilterPanelValues = {};
    if (filters?.assignee && filters.assignee !== 'All') {
      value.assignee = [filters.assignee];
    }
    return value;
  }, [filters]);

  const sortValue =
    filters?.sortBy === 'Created Date' ? null : (filters?.sortBy ?? null);

  const filterBarFilters = useMemo(
    () => [
      {
        id: 'priority',
        label: 'Priority',
        icon: 'priority' as const,
        options: [...PRIORITY_OPTIONS],
        value: filters?.priority === 'All' ? null : filters?.priority,
      },
      {
        id: 'status',
        label: 'Status',
        icon: 'todo' as const,
        options: [...STATUS_OPTIONS],
        value: filters?.status === 'All' ? null : filters?.status,
      },
    ],
    [filters?.priority, filters?.status]
  );

  const assigneeOptions = useMemo(() => {
    if (!users) return [];
    return users
      .filter((user) => user.email)
      .map((user) => ({
        value: user.email as string,
        label: user.name || user.email || '',
      }));
  }, [users]);

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        key: 'assignee',
        label: 'Assignee',
        icon: <Icon name="user" size="sm" />,
        options: assigneeOptions,
        searchable: true,
      },
    ],
    [assigneeOptions]
  );

  const handleFilterPanelChange = (value: FilterPanelValues) => {
    if (!onFilterChange) return;
    const allGroupKeys = filterGroups.map((g) => g.key);
    for (const key of allGroupKeys) {
      const values = value[key];
      if (values && values.length > 0) {
        onFilterChange(key, values[0]);
      } else {
        onFilterChange(key, 'All');
      }
    }
  };

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    onFilterChange?.(filterId, value ?? 'All');
  };

  const handleSortChange = (value: string | null) => {
    onFilterChange?.('sortBy', value ?? 'Created Date');
  };

  return {
    filterPanelValue,
    sortOptions: [...SORT_OPTIONS],
    sortValue,
    filterBarFilters,
    filterGroups,
    handleFilterPanelChange,
    handleFilterBarChange,
    handleSortChange,
  };
}
