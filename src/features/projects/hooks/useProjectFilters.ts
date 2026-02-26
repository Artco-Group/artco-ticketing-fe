import { useState, useMemo } from 'react';
import {
  ProjectPriority,
  ProjectPriorityDisplay,
  ProjectPrioritySortOrder,
} from '@artco-group/artco-ticketing-sync';
import { type ProjectWithProgress } from '@/types';
import { type ProjectSortKey } from '../utils/project-helpers';
import {
  byString,
  byDateAsc,
  byDateDesc,
  byNumberDesc,
  byRankDesc,
} from '@/shared/utils/sort.utils';

const projectSortComparators: Record<
  ProjectSortKey,
  (a: ProjectWithProgress, b: ProjectWithProgress) => number
> = {
  Name: byString((p) => p.name),
  Priority: byRankDesc(
    (p) => p.priority as string,
    ProjectPrioritySortOrder as unknown as Record<string, number>
  ),
  'Due Date': byDateAsc((p) => p.dueDate),
  Progress: byNumberDesc((p) => p.progress?.percentage),
  Updated: byDateDesc((p) => p.updatedAt),
};

export function useProjectFilters<T extends ProjectWithProgress>(
  projects: T[]
) {
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<string | null>(null);
  const [projectManagerFilter, setProjectManagerFilter] = useState<
    string | null
  >(null);
  const [sortBy, setSortBy] = useState<ProjectSortKey | null>(null);

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

      const matchesProjectManager =
        !projectManagerFilter ||
        project.projectManagers?.some((pm) => pm.id === projectManagerFilter);

      return (
        matchesPriority && matchesStatus && matchesLead && matchesProjectManager
      );
    });

    if (sortBy) {
      result = [...result].sort(projectSortComparators[sortBy]);
    }

    return result;
  }, [
    projects,
    priorityFilter,
    statusFilter,
    leadFilter,
    projectManagerFilter,
    sortBy,
  ]);

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
      case 'projectManager':
        setProjectManagerFilter(!value || value === 'All' ? null : value);
        break;
      case 'sortBy':
        setSortBy(value as ProjectSortKey | null);
        break;
    }
  };

  return {
    filteredProjects,
    priorityFilter,
    statusFilter,
    leadFilter,
    projectManagerFilter,
    sortBy,
    setPriorityFilter,
    onFilterChange: handleFilterChange,
  };
}
