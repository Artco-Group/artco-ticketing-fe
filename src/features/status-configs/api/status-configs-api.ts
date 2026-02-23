import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  type CreateStatusConfigInput,
  type UpdateStatusConfigInput,
  type StatusConfigListResponse,
  type StatusConfigResponse,
  type StatusConfigProjectsResponse,
} from '@artco-group/artco-ticketing-sync';

function useStatusConfigs() {
  return useApiQuery<StatusConfigListResponse>(QueryKeys.statusConfigs.list(), {
    url: '/status-configs',
  });
}

function useStatusConfig(id: string | undefined) {
  return useApiQuery<StatusConfigResponse>(
    QueryKeys.statusConfigs.detail(id || ''),
    {
      url: `/status-configs/${id}`,
      enabled: !!id,
    }
  );
}

function useProjectsUsingConfig(configId: string | undefined) {
  return useApiQuery<StatusConfigProjectsResponse>(
    QueryKeys.statusConfigs.projects(configId || ''),
    {
      url: `/status-configs/${configId}/projects`,
      enabled: !!configId,
    }
  );
}

function useCreateStatusConfig() {
  const queryClient = useQueryClient();

  return useApiMutation<StatusConfigResponse, CreateStatusConfigInput>({
    url: '/status-configs',
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
    url: (variables) => `/status-configs/${variables.id}`,
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
    url: (id) => `/status-configs/${id}`,
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
      `/status-configs/projects/${variables.projectSlug}/assign`,
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
