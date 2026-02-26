import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  type CreateStatusConfigInput,
  type UpdateStatusConfigInput,
  type StatusConfigListResponse,
  type StatusConfigResponse,
  type StatusConfigProjectsResponse,
} from '@artco-group/artco-ticketing-sync';

function useStatusConfigs() {
  return useApiQuery<StatusConfigListResponse>(QueryKeys.statusConfigs.list(), {
    url: API_ROUTES.STATUS_CONFIGS.BASE,
  });
}

function useStatusConfig(id: string | undefined) {
  return useApiQuery<StatusConfigResponse>(
    QueryKeys.statusConfigs.detail(id || ''),
    {
      url: API_ROUTES.STATUS_CONFIGS.BY_ID(id || ''),
      enabled: !!id,
    }
  );
}

function useProjectsUsingConfig(configId: string | undefined) {
  return useApiQuery<StatusConfigProjectsResponse>(
    QueryKeys.statusConfigs.projects(configId || ''),
    {
      url: API_ROUTES.STATUS_CONFIGS.PROJECTS(configId || ''),
      enabled: !!configId,
    }
  );
}

function useCreateStatusConfig() {
  const queryClient = useQueryClient();

  return useApiMutation<StatusConfigResponse, CreateStatusConfigInput>({
    url: API_ROUTES.STATUS_CONFIGS.BASE,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.statusConfigs.all(),
      });
    },
  });
}

function useUpdateStatusConfig() {
  const queryClient = useQueryClient();

  return useApiMutation<
    StatusConfigResponse,
    { id: string; data: UpdateStatusConfigInput }
  >({
    url: (variables) => API_ROUTES.STATUS_CONFIGS.BY_ID(variables.id),
    method: 'PATCH',
    getBody: (variables) => variables.data,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.statusConfigs.all(),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.statusConfigs.detail(variables.id),
      });
    },
  });
}

function useDeleteStatusConfig() {
  const queryClient = useQueryClient();

  return useApiMutation<void, string>({
    url: (id) => API_ROUTES.STATUS_CONFIGS.BY_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.statusConfigs.all(),
      });
    },
  });
}

function useAssignStatusConfig() {
  const queryClient = useQueryClient();

  return useApiMutation<
    void,
    { projectSlug: string; statusConfigId: string | null }
  >({
    url: (variables) =>
      API_ROUTES.PROJECTS.STATUS_CONFIG(variables.projectSlug),
    method: 'PATCH',
    getBody: (variables) => ({ statusConfigId: variables.statusConfigId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.statusConfigs.all(),
      });
    },
  });
}

export {
  useStatusConfigs,
  useStatusConfig,
  useProjectsUsingConfig,
  useCreateStatusConfig,
  useUpdateStatusConfig,
  useDeleteStatusConfig,
  useAssignStatusConfig,
};
