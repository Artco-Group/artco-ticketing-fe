import {
  StatusIdTranslationKeys,
  DEFAULT_STATUSES,
} from '@artco-group/artco-ticketing-sync';
import type { StatusConfig } from '@artco-group/artco-ticketing-sync/types';
import { useAppTranslation } from './useAppTranslation';

export function useStatusLabel() {
  const { translate } = useAppTranslation('tickets');

  const getStatusLabel = (
    statusId: string,
    statusConfig?: StatusConfig | null
  ): string => {
    if (statusConfig?.statuses && !statusConfig.isDefault) {
      const customStatus = statusConfig.statuses.find((s) => s.id === statusId);
      if (customStatus) {
        return customStatus.name;
      }
    }

    const translationKey = StatusIdTranslationKeys[statusId];
    if (translationKey) {
      return translate(translationKey);
    }

    const defaultStatus = DEFAULT_STATUSES.find((s) => s.id === statusId);
    return defaultStatus?.name || statusId;
  };

  return { getStatusLabel };
}
