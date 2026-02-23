import { useMemo } from 'react';
import type { User, Filters, Ticket } from '@/types';
import type {
  FilterGroup,
  FilterPanelValues,
} from '@/shared/components/patterns';
import { Icon } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';
import { getUniqueStatusOptions } from '@/shared/utils/ticket-helpers';
import { useTranslatedOptions } from './useTranslatedOptions';

interface UseTicketFiltersProps {
  filters: Filters | undefined;
  users: User[];
  tickets?: Ticket[];
  onFilterChange: ((filterType: string, value: string) => void) | undefined;
}

export function useTicketFilters({
  filters,
  users,
  tickets,
  onFilterChange,
}: UseTicketFiltersProps) {
  const { translate } = useAppTranslation('tickets');
  const {
    priorityOptions,
    statusOptions: defaultStatusOptions,
    sortOptions,
    mapToStatusOptions,
  } = useTranslatedOptions();

  const filterPanelValue = useMemo<FilterPanelValues>(() => {
    const value: FilterPanelValues = {};
    if (filters?.assignee && filters.assignee !== 'All') {
      value.assignee = [filters.assignee];
    }
    if (filters?.project && filters.project !== 'All') {
      value.project = [filters.project];
    }
    return value;
  }, [filters]);

  const statusOptions = useMemo(() => {
    const dynamicOptions = tickets ? getUniqueStatusOptions(tickets) : [];
    return dynamicOptions.length > 0
      ? mapToStatusOptions(dynamicOptions)
      : defaultStatusOptions;
  }, [tickets, defaultStatusOptions, mapToStatusOptions]);

  const projectOptions = useMemo(() => {
    if (!tickets) return [];
    const projectMap = new Map<string, { id: string; name: string }>();
    for (const ticket of tickets) {
      if (ticket.project?.id && ticket.project?.name) {
        projectMap.set(ticket.project.id, {
          id: ticket.project.id,
          name: ticket.project.name,
        });
      }
    }
    return Array.from(projectMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => ({ value: p.id, label: p.name }));
  }, [tickets]);

  const sortValue =
    filters?.sortBy === 'Created Date' ? null : (filters?.sortBy ?? null);

  const filterBarFilters = useMemo(
    () => [
      {
        id: 'priority',
        label: translate('filters.priority'),
        icon: 'priority' as const,
        options: priorityOptions,
        value: filters?.priority === 'All' ? null : filters?.priority,
      },
      {
        id: 'status',
        label: translate('filters.status'),
        icon: 'todo' as const,
        options: statusOptions,
        value: filters?.status === 'All' ? null : filters?.status,
      },
    ],
    [
      filters?.priority,
      filters?.status,
      translate,
      priorityOptions,
      statusOptions,
    ]
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
        label: translate('filters.assignee'),
        icon: <Icon name="user" size="sm" />,
        options: assigneeOptions,
        searchable: true,
      },
      {
        key: 'project',
        label: translate('filters.project'),
        icon: <Icon name="folder" size="sm" />,
        options: projectOptions,
        searchable: true,
      },
    ],
    [assigneeOptions, projectOptions, translate]
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
    sortOptions,
    sortValue,
    filterBarFilters,
    filterGroups,
    handleFilterPanelChange,
    handleFilterBarChange,
    handleSortChange,
  };
}
