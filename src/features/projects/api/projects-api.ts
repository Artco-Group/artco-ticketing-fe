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
import type { ApiResponse, ProjectId } from '@/types';

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

function useProject(slug: ProjectId | undefined) {
  return useApiQuery<ApiResponse<{ project: ProjectWithProgress }>>(
    QueryKeys.projects.detail(slug!),
    {
      url: API_ROUTES.PROJECTS.BY_SLUG(slug!),
      enabled: !!slug,
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
    { slug: ProjectId; data: UpdateProjectFormData }
  >({
    url: (vars) => API_ROUTES.PROJECTS.BY_SLUG(vars.slug),
    method: 'PUT',
    getBody: (vars) => vars.data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.slug),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

function useDeleteProject() {
  return useApiMutation<void, ProjectId>({
    url: (slug) => API_ROUTES.PROJECTS.BY_SLUG(slug),
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

interface BulkDeleteResult {
  deletedCount: number;
  failedIds: string[];
}

/**
 * Bulk delete projects
 */
function useBulkDeleteProjects() {
  return useApiMutation<ApiResponse<BulkDeleteResult>, { ids: string[] }>({
    url: API_ROUTES.PROJECTS.BASE,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

function useAddProjectMembers() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    { slug: ProjectId; data: AddProjectMembersFormData }
  >({
    url: (vars) => API_ROUTES.PROJECTS.MEMBERS(vars.slug),
    method: 'POST',
    getBody: (vars) => vars.data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.slug),
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

function useProjectTickets(projectId: ProjectId | undefined) {
  return useApiQuery<ApiResponse<{ tickets: unknown[] }>>(
    QueryKeys.projects.tickets(projectId!),
    {
      url: API_ROUTES.PROJECTS.TICKETS(projectId!),
      enabled: !!projectId,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

function useArchiveProject() {
  return useApiMutation<
    ApiResponse<{ project: Project }>,
    { slug: ProjectId; isArchived: boolean }
  >({
    url: (vars) => API_ROUTES.PROJECTS.ARCHIVE(vars.slug),
    method: 'PATCH',
    getBody: (vars) => ({ isArchived: vars.isArchived }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.detail(variables.slug),
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
  useBulkDeleteProjects,
  useAddProjectMembers,
  useRemoveProjectMember,
  useProjectTickets,
  useArchiveProject,
};
