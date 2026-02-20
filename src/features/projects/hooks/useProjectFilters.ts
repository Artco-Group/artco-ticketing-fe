import { useState, useMemo } from 'react';
import {
  ProjectPriority,
  ProjectPriorityDisplay,
  ProjectPrioritySortOrder,
} from '@artco-group/artco-ticketing-sync';
import { type ProjectWithProgress } from '@/types';

type SortOption =
  | 'Name'
  | 'Priority'
  | 'Due Date'
  | 'Progress'
  | 'Updated'
  | null;

export function useProjectFilters<T extends ProjectWithProgress>(
  projects: T[]
) {
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(null);

  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      const matchesPriority =
        priorityFilter === 'All' ||
        ProjectPriorityDisplay[project.priority as ProjectPriority] ===
          priorityFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'Active' && !project.isArchived) ||
        (statusFilter === 'Archived' && project.isArchived);

      const matchesLead =
        !leadFilter || project.leads?.some((lead) => lead.id === leadFilter);

      return matchesPriority && matchesStatus && matchesLead;
    });

    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'Name':
            return (a.name || '').localeCompare(b.name || '');
          case 'Priority':
            return (
              (ProjectPrioritySortOrder[b.priority as ProjectPriority] ?? 0) -
              (ProjectPrioritySortOrder[a.priority as ProjectPriority] ?? 0)
            );
          case 'Due Date': {
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            return dateA - dateB;
          }
          case 'Progress':
            return (
              (b.progress?.percentage || 0) - (a.progress?.percentage || 0)
            );
          case 'Updated': {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return dateB - dateA;
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [projects, priorityFilter, statusFilter, leadFilter, sortBy]);

  const handleFilterChange = (filterId: string, value: string | null) => {
    switch (filterId) {
      case 'priority':
        setPriorityFilter(!value || value === 'All' ? 'All' : value);
        break;
      case 'status':
        setStatusFilter(!value || value === 'All' ? null : value);
        break;
      case 'lead':
        setLeadFilter(!value || value === 'All' ? null : value);
        break;
      case 'sortBy':
        setSortBy(value as SortOption);
        break;
    }
  };

  return {
    filteredProjects,
    priorityFilter,
    statusFilter,
    leadFilter,
    sortBy,
    setPriorityFilter,
    onFilterChange: handleFilterChange,
  };
}
