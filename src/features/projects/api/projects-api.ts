import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Project,
  type CreateProjectFormData,
  type UpdateProjectFormData,
  type AddProjectMembersFormData,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { ApiResponse } from '@/types';

type ProjectId = string;

interface ProjectWithProgress extends Project {
  progress: {
    totalTickets: number;
    completedTickets: number;
    percentage: number;
  };
}

function useProjects(params?: Record<string, unknown>) {
  return useApiQuery<ApiResponse<{ projects: ProjectWithProgress[] }>>(
    QueryKeys.projects.list(params),
    {
      url: API_ROUTES.PROJECTS.BASE,
      params,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

function useProject(id: ProjectId) {
  return useApiQuery<ApiResponse<{ project: ProjectWithProgress }>>(
    QueryKeys.projects.detail(id),
    {
      url: API_ROUTES.PROJECTS.BY_ID(id),
      enabled: !!id,
      staleTime: CACHE.STALE_TIME,
    }
  );
}

function useCreateProject() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    CreateProjectFormData
  >({
    url: API_ROUTES.PROJECTS.BASE,
    method: 'POST',
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.all(),
        exact: false,
      });
    },
  });
}

function useUpdateProject() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    { id: ProjectId; data: UpdateProjectFormData }
  >({
    url: (vars) => API_ROUTES.PROJECTS.BY_ID(vars.id),
    method: 'PUT',
    getBody: (vars) => vars.data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

function useDeleteProject() {
  return useApiMutation<void, ProjectId>({
    url: (id) => API_ROUTES.PROJECTS.BY_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

function useAddProjectMembers() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    { id: ProjectId; data: AddProjectMembersFormData }
  >({
    url: (vars) => API_ROUTES.PROJECTS.MEMBERS(vars.id),
    method: 'POST',
    getBody: (vars) => vars.data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useRemoveProjectMember() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    { projectId: ProjectId; memberId: string }
  >({
    url: (vars) =>
      API_ROUTES.PROJECTS.REMOVE_MEMBER(vars.projectId, vars.memberId),
    method: 'DELETE',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.projectId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useProjectTickets(projectId: ProjectId) {
  return useApiQuery<ApiResponse<{ tickets: unknown[] }>>(
    QueryKeys.projects.tickets(projectId),
    {
      url: API_ROUTES.PROJECTS.TICKETS(projectId),
      enabled: !!projectId,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

function useArchiveProject() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    { id: ProjectId; isArchived: boolean }
  >({
    url: (vars) => API_ROUTES.PROJECTS.ARCHIVE(vars.id),
    method: 'PATCH',
    getBody: (vars) => ({ isArchived: vars.isArchived }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

export {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddProjectMembers,
  useRemoveProjectMember,
  useProjectTickets,
  useArchiveProject,
};
