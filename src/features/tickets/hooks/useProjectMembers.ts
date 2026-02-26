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
  clientEmail: string;
  isLoading: boolean;
}

export function useProjectMembers(
  selectedProjectId?: string,
  filterByClientEmail?: string
): UseProjectMembersResult {
  const { data: projectsData, isLoading } = useProjects();

  const projectOptions = useMemo(
    () =>
      (projectsData?.projects || [])
        .filter((project) => !project.isArchived)
        .filter(
          (project) =>
            !filterByClientEmail ||
            project.client?.email === filterByClientEmail
        )
        .map((project) => ({
          label: project.name,
          value: (project.id || '') as string,
        })),
    [projectsData?.projects, filterByClientEmail]
  );

  const selectedProject = useMemo(() => {
    if (!selectedProjectId || !projectsData?.projects) return null;
    return (
      projectsData.projects.find((p) => p.id === selectedProjectId) ?? null
    );
  }, [selectedProjectId, projectsData]);

  const developerUsers = useMemo(() => {
    if (!selectedProject) return [];
    const members = (selectedProject.members as User[]) || [];
    return members.filter((u) => u.role === UserRole.DEVELOPER);
  }, [selectedProject]);

  const engLeadUsers = useMemo(() => {
    if (!selectedProject) return [];
    return (selectedProject.leads as User[]) || [];
  }, [selectedProject]);

  const clientEmail = useMemo(
    () => selectedProject?.client?.email || '',
    [selectedProject]
  );

  return {
    projectOptions,
    developerUsers,
    engLeadUsers,
    clientEmail,
    isLoading,
  };
}
