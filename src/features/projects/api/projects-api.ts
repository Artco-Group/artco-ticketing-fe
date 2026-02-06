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

// Project with computed progress
interface ProjectWithProgress extends Project {
  progress: {
    totalTickets: number;
    completedTickets: number;
    percentage: number;
  };
}

/**
 * Get all projects
 * Uses SHORT_STALE_TIME for frequently changing list data
 */
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

/**
 * Get single project by ID
 * Uses STALE_TIME for individual records
 */
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

/**
 * Create a new project
 */
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

/**
 * Update a project
 */
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

/**
 * Delete a project
 */
function useDeleteProject() {
  return useApiMutation<void, ProjectId>({
    url: (id) => API_ROUTES.PROJECTS.BY_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

/**
 * Add members to a project
 */
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
      // Invalidate tickets since they embed project members for assignment filtering
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Remove a member from a project
 */
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
      // Invalidate tickets since they embed project members for assignment filtering
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Get tickets for a project
 */
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

/**
 * Archive/unarchive a project
 */
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

/**
 * Namespaced API export
 */
export const projectsApi = {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddProjectMembers,
  useRemoveProjectMember,
  useProjectTickets,
  useArchiveProject,
  keys: QueryKeys.projects,
};

// Individual exports for backwards compatibility
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
