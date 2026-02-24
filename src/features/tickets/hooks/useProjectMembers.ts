import { useMemo } from 'react';
import { type User, UserRole } from '@artco-group/artco-ticketing-sync';
import { useProjects } from '@/features/projects/api/projects-api';

interface ProjectOption {
  label: string;
  value: string;
}

interface UseProjectMembersResult {
  projectOptions: ProjectOption[];
  developerUsers: User[];
  engLeadUsers: User[];
  isLoading: boolean;
}

export function useProjectMembers(
  selectedProjectId?: string
): UseProjectMembersResult {
  const { data: projectsData, isLoading } = useProjects();

  const projectOptions = useMemo(
    () =>
      (projectsData?.projects || [])
        .filter((project) => !project.isArchived)
        .map((project) => ({
          label: project.name,
          value: (project.id || '') as string,
        })),
    [projectsData?.projects]
  );

  const developerUsers = useMemo(() => {
    if (!selectedProjectId || !projectsData?.projects) return [];

    const selectedProject = projectsData.projects.find(
      (p) => p.id === selectedProjectId
    );
    if (!selectedProject) return [];

    const members = (selectedProject.members as User[]) || [];
    return members.filter((u) => u.role === UserRole.DEVELOPER);
  }, [selectedProjectId, projectsData]);

  const engLeadUsers = useMemo(() => {
    if (!selectedProjectId || !projectsData?.projects) return [];

    const selectedProject = projectsData.projects.find(
      (p) => p.id === selectedProjectId
    );
    if (!selectedProject) return [];

    return (selectedProject.leads as User[]) || [];
  }, [selectedProjectId, projectsData]);

  return {
    projectOptions,
    developerUsers,
    engLeadUsers,
    isLoading,
  };
}
