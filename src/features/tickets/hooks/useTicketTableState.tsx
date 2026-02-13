import { useMemo, useState, useCallback } from 'react';
import {
  TicketStatusSortOrder,
  TicketPrioritySortOrder,
} from '@artco-group/artco-ticketing-sync';
import { TicketPriority, TicketStatus, type Ticket, type User } from '@/types';
import {
  type SortDirection,
  type BulkAction,
  useToast,
} from '@/shared/components/ui';
import { type GroupConfig } from '@/shared/hooks/useGroupedData';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
} from '@/shared/utils/ticket-helpers';
import { Icon } from '@/shared/components/ui/Icon';
import { useBulkDeleteTickets, useBulkUpdatePriority } from '../api';

interface UseTicketTableStateProps {
  users: User[];
}

export function useTicketTableState({ users }: UseTicketTableStateProps) {
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
        label: 'Change Priority',
        icon: <Icon name="edit" size="sm" />,
        onClick: () => setShowPriorityDialog(true),
      },
      {
        label: 'Delete',
        icon: <Icon name="trash" size="sm" />,
        onClick: () => setShowDeleteConfirm(true),
        variant: 'destructive' as const,
      },
    ],
    []
  );

  const groupConfigs: GroupConfig<Ticket>[] = useMemo(
    () => [
      {
        key: 'status',
        getGroupKey: (ticket) => ticket.status || 'Unknown',
        getLabel: (key) => getStatusLabel(key as TicketStatus),
        getIcon: (key) => getStatusIcon(key as TicketStatus),
        sortOrder: TicketStatusSortOrder,
      },
      {
        key: 'priority',
        getGroupKey: (ticket) => ticket.priority || 'Unknown',
        getLabel: (key) => getPriorityLabel(key as TicketPriority),
        getIcon: (key) => getPriorityIcon(key as TicketPriority),
        sortOrder: TicketPrioritySortOrder,
        sortDirection: 'desc',
      },
      {
        key: 'assignee',
        getGroupKey: (ticket) =>
          ticket.assignedTo
            ? resolveAssigneeName(ticket.assignedTo, users)
            : 'Unassigned',
        getIcon: () => (
          <Icon name="user" size="sm" className="text-greyscale-500" />
        ),
      },
      {
        key: 'dueDate',
        getGroupKey: (ticket) => {
          if (ticket.dueDate) {
            const date = new Date(ticket.dueDate);
            return date.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            });
          }
          return 'No Due Date';
        },
        getIcon: () => (
          <Icon name="clock" size="sm" className="text-greyscale-500" />
        ),
      },
    ],
    [users]
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
