import { useMemo, useCallback, type ReactNode } from 'react';
import type {
  StatusConfig,
  StatusDefinition,
} from '@artco-group/artco-ticketing-sync/types';
import { StatusIdTranslationKeys } from '@artco-group/artco-ticketing-sync';
import { getStatusIconFromDefinition } from '@/shared/utils/ticket-helpers';
import { useAppTranslation } from '@/shared/hooks';

interface StatusOption {
  value: string;
  label: string;
  icon: ReactNode;
}

/**
 * Hook to get status options from a workflow configuration
 * Returns status options with icons based on the project's workflow
 * - Custom workflows: Returns configured names directly
 * - Default config: Returns translated labels
 */
export function useWorkflowStatusOptions(statusConfig?: StatusConfig | null) {
  const { translate } = useAppTranslation('tickets');
  const isDefaultConfig = statusConfig?.isDefault ?? false;

  // Helper to get translated label for default statuses
  const getTranslatedLabel = useCallback(
    (status: StatusDefinition): string => {
      if (!isDefaultConfig) {
        return status.name;
      }
      // For default config, use translation
      const translationKey = StatusIdTranslationKeys[status.id];
      if (translationKey) {
        return translate(translationKey);
      }
      return status.name;
    },
    [isDefaultConfig, translate]
  );

  const statusOptions = useMemo<StatusOption[]>(() => {
    if (!statusConfig?.statuses) {
      return [];
    }

    return statusConfig.statuses
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((status) => ({
        value: status.id,
        label: getTranslatedLabel(status),
        icon: getStatusIconFromDefinition(status),
      }));
  }, [statusConfig, getTranslatedLabel]);

  const getStatusLabel = useCallback(
    (statusId: string): string => {
      if (!statusConfig?.statuses) return statusId;
      const status = statusConfig.statuses.find((s) => s.id === statusId);
      if (!status) return statusId;
      return getTranslatedLabel(status);
    },
    [statusConfig, getTranslatedLabel]
  );

  const getStatusIcon = useCallback(
    (statusId: string): ReactNode => {
      if (!statusConfig?.statuses) return null;
      const status = statusConfig.statuses.find((s) => s.id === statusId);
      if (!status) return null;
      return getStatusIconFromDefinition(status);
    },
    [statusConfig]
  );

  return {
    statusOptions,
    getStatusLabel,
    getStatusIcon,
    hasWorkflow: !!statusConfig?.statuses?.length,
  };
}
