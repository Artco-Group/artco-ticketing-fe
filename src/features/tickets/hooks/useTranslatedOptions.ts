import { useMemo } from 'react';
import {
  TicketCategory,
  TicketPriority,
  TicketSortField,
  StatusIdTranslationKeys,
  TicketPriorityTranslationKeys,
  TicketCategoryTranslationKeys,
  TicketSortFieldTranslationKeys,
  DEFAULT_STATUSES,
} from '@artco-group/artco-ticketing-sync';
import { useAppTranslation } from '@/shared/hooks';

export function useTranslatedOptions() {
  const { translate } = useAppTranslation('tickets');

  const statusOptions = useMemo(
    () =>
      DEFAULT_STATUSES.map((status) => ({
        label: translate(StatusIdTranslationKeys[status.id]) || status.name,
        value: status.id,
      })),
    [translate]
  );

  const priorityOptions = useMemo(
    () =>
      Object.values(TicketPriority).map((priority) => ({
        label: translate(TicketPriorityTranslationKeys[priority]),
        value: priority,
      })),
    [translate]
  );

  const categoryOptions = useMemo(
    () =>
      Object.values(TicketCategory).map((category) => ({
        label: translate(TicketCategoryTranslationKeys[category]),
        value: category,
      })),
    [translate]
  );

  const sortOptions = useMemo(
    () =>
      Object.values(TicketSortField).map((field) => ({
        label: translate(TicketSortFieldTranslationKeys[field]),
        value: field,
      })),
    [translate]
  );

  const getStatusLabel = (statusId: string): string => {
    const translationKey = StatusIdTranslationKeys[statusId];
    if (translationKey) {
      return translate(translationKey);
    }
    const status = DEFAULT_STATUSES.find((s) => s.id === statusId);
    return status?.name || statusId;
  };

  const getStatusLabelWithFallback = (
    statusId: string,
    fallbackName: string
  ): string => {
    const translationKey = StatusIdTranslationKeys[statusId];
    return translationKey ? translate(translationKey) : fallbackName;
  };

  const mapToStatusOptions = (statuses: { id: string; name: string }[]) =>
    statuses.map((s) => ({
      value: s.id,
      label: getStatusLabelWithFallback(s.id, s.name),
    }));

  const getPriorityLabel = (priority: TicketPriority): string =>
    translate(TicketPriorityTranslationKeys[priority]) || priority;

  const getCategoryLabel = (category: TicketCategory): string =>
    translate(TicketCategoryTranslationKeys[category]) || category;

  return {
    statusOptions,
    priorityOptions,
    categoryOptions,
    sortOptions,
    getStatusLabel,
    getStatusLabelWithFallback,
    mapToStatusOptions,
    getPriorityLabel,
    getCategoryLabel,
  };
}
