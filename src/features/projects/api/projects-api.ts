import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Project,
  type ProjectWithProgress,
  type Ticket,
  type ProjectQueryParams,
  type CreateProjectFormData,
  type UpdateProjectFormData,
  type AddProjectMembersFormData,
  type ApiResponse,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { ProjectId } from '@/types';

function useProjects(params?: ProjectQueryParams) {
  return useApiQuery<{ projects: ProjectWithProgress[] }>(
    QueryKeys.projects.list(params),
    {
      url: API_ROUTES.PROJECTS.BASE,
      params,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

function useProject(slug: ProjectId | undefined) {
  return useApiQuery<{ project: ProjectWithProgress }>(
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

interface DeleteManyResult {
  deletedCount: number;
  failedIds: string[];
}

interface ArchiveManyResult {
  archivedCount: number;
  failedIds: string[];
}

function useDeleteManyProjects() {
  return useApiMutation<ApiResponse<DeleteManyResult>, { slugs: string[] }>({
    url: API_ROUTES.PROJECTS.BASE,
    method: 'DELETE',
    getBody: (vars) => vars,
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
  return useApiQuery<{ tickets: Ticket[] }>(
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

function useArchiveManyProjects() {
  return useApiMutation<
    ApiResponse<ArchiveManyResult>,
    { slugs: string[]; isArchived: boolean }
  >({
    url: API_ROUTES.PROJECTS.ARCHIVE_MANY,
    method: 'PATCH',
    getBody: (vars) => vars,
    onSuccess: () => {
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
  useDeleteManyProjects,
  useAddProjectMembers,
  useRemoveProjectMember,
  useProjectTickets,
  useArchiveProject,
  useArchiveManyProjects,
};
