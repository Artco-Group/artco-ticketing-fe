import { useMemo, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { enUS, bs } from 'date-fns/locale';
import {
  TicketStatusSortOrder,
  TicketPrioritySortOrder,
  TicketPriorityTranslationKeys,
} from '@artco-group/artco-ticketing-sync';
import { TicketPriority, type Ticket, type User } from '@/types';
import {
  type SortDirection,
  type BulkAction,
  useToast,
} from '@/shared/components/ui';
import { type GroupConfig } from '@/shared/hooks/useGroupedData';
import { useAppTranslation, useStatusLabel } from '@/shared/hooks';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getDynamicStatusIcon,
} from '@/shared/utils/ticket-helpers';
import { Icon } from '@/shared/components/ui/Icon';
import { useBulkDeleteTickets, useBulkUpdatePriority } from '../api';

interface UseTicketTableStateProps {
  users: User[];
}

export function useTicketTableState({ users }: UseTicketTableStateProps) {
  const { translate, language } = useAppTranslation('tickets');
  const { getStatusLabel } = useStatusLabel();
  const toast = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteTickets();
  const { mutate: bulkUpdatePriority, isPending: isUpdatingPriority } =
    useBulkUpdatePriority();

  const clearSelection = useCallback(() => setSelectedRows([]), []);

  const handleBulkDelete = useCallback(() => {
    const ticketIds = selectedRows.filter((id) => id.length > 0);

    if (ticketIds.length === 0) {
      toast.error('No valid tickets selected for deletion');
      return;
    }

    bulkDelete(
      { ticketIds },
      {
        onSuccess: () => {
          clearSelection();
          setShowDeleteConfirm(false);
          toast.success(
            `Deleted ${ticketIds.length} ticket${ticketIds.length > 1 ? 's' : ''}`
          );
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to delete tickets');
        },
      }
    );
  }, [bulkDelete, selectedRows, clearSelection, toast]);

  const handleBulkPriorityChange = useCallback(
    (priority: TicketPriority) => {
      const count = selectedRows.length;
      bulkUpdatePriority(
        { ids: selectedRows, priority },
        {
          onSuccess: () => {
            clearSelection();
            setShowPriorityDialog(false);
            toast.success(
              `Priority updated for ${count} ticket${count > 1 ? 's' : ''}`
            );
          },
        }
      );
    },
    [bulkUpdatePriority, selectedRows, clearSelection, toast]
  );

  const handleSort = useCallback((col: string | null, dir: SortDirection) => {
    setSortColumn(col);
    setSortDirection(dir);
  }, []);

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: translate('bulkActions.changePriority'),
        icon: <Icon name="edit" size="sm" />,
        onClick: () => setShowPriorityDialog(true),
      },
      {
        label: translate('bulkActions.delete'),
        icon: <Icon name="trash" size="sm" />,
        onClick: () => setShowDeleteConfirm(true),
        variant: 'destructive' as const,
      },
    ],
    [translate]
  );

  const groupConfigs: GroupConfig<Ticket>[] = useMemo(
    () => [
      {
        key: 'status',
        getGroupKey: (ticket) => ticket.status || 'Unknown',
        getLabel: (key) => getStatusLabel(key),
        getIcon: (key) => getDynamicStatusIcon(key),
        sortOrder: TicketStatusSortOrder,
      },
      {
        key: 'priority',
        getGroupKey: (ticket) => ticket.priority || 'Unknown',
        getLabel: (key) => {
          const translationKey =
            TicketPriorityTranslationKeys[key as TicketPriority];
          return translationKey ? translate(translationKey) : key;
        },
        getIcon: (key) => getPriorityIcon(key as TicketPriority),
        sortOrder: TicketPrioritySortOrder,
        sortDirection: 'desc',
      },
      {
        key: 'assignee',
        getGroupKey: (ticket) =>
          ticket.assignedTo
            ? resolveAssigneeName(ticket.assignedTo, users)
            : translate('form.unassigned'),
        getIcon: () => (
          <Icon name="user" size="sm" className="text-greyscale-500" />
        ),
      },
      {
        key: 'project',
        getGroupKey: (ticket) =>
          ticket.project?.name ?? translate('groupBy.noProject'),
        getIcon: () => (
          <Icon name="folder" size="sm" className="text-greyscale-500" />
        ),
      },
      {
        key: 'dueDate',
        getGroupKey: (ticket) => {
          if (ticket.dueDate) {
            const date = new Date(ticket.dueDate);
            const locale = language === 'bs' ? bs : enUS;
            return format(date, 'LLLL yyyy', { locale });
          }
          return translate('groupBy.noDueDate');
        },
        getIcon: () => (
          <Icon name="clock" size="sm" className="text-greyscale-500" />
        ),
      },
    ],
    [users, translate, language, getStatusLabel]
  );

  return {
    selectedRows,
    setSelectedRows,
    clearSelection,

    sortColumn,
    sortDirection,
    handleSort,

    showDeleteConfirm,
    setShowDeleteConfirm,
    handleBulkDelete,
    isDeleting,

    showPriorityDialog,
    setShowPriorityDialog,
    handleBulkPriorityChange,
    isUpdatingPriority,

    bulkActions,
    groupConfigs,
  };
}
