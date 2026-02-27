import { useState, useCallback } from 'react';
import {
  asTicketId,
  asUserId,
  type Ticket,
  type User,
  UserRole,
} from '@/types';
import {
  TicketCategory,
  DEFAULT_STATUS_GROUPS,
} from '@artco-group/artco-ticketing-sync';
import { useTranslatedToast } from '@/shared/hooks';
import {
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useAssignTicket,
  useAssignEngLead,
  useUpdateTicket,
} from '../api/tickets-api';

interface UseTicketInlineEditProps {
  ticket: Ticket | null;
  users?: User[];
  isClient: boolean;
  isEngLead: boolean;
  isAdmin?: boolean;
  isDeveloper?: boolean;
}

/**
 * Custom hook for inline editing ticket fields.
 * Handles status, priority, category, and assignee updates.
 */
export function useTicketInlineEdit({
  ticket,
  users = [],
  isClient,
  isEngLead,
  isAdmin = false,
  isDeveloper = false,
}: UseTicketInlineEditProps) {
  const translatedToast = useTranslatedToast();

  const updateStatus = useUpdateTicketStatus();
  const updatePriority = useUpdateTicketPriority();
  const assignTicket = useAssignTicket();
  const assignEngLead = useAssignEngLead();
  const updateTicket = useUpdateTicket();

  // Resolution dialog state
  const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const canManage = isEngLead || isAdmin;
  const canEditStatus = !isClient;
  const canEditPriority = canManage;
  const canEditAssignee = canManage;
  const canEditCategory = canManage;
  const canEditDates = canManage;
  const canEditSolutionDates = canManage || isDeveloper;
  const canEditProject = canManage;
  const canEditEngLead = canManage;

  // Get project member IDs for filtering
  const projectMemberIds = new Set(
    (ticket?.project?.members || []).map((m) => m.id)
  );

  // Filter developers to only those who are members of the ticket's project
  const developerUsers = users.filter(
    (user) =>
      user.role === UserRole.DEVELOPER &&
      (projectMemberIds.size === 0 || projectMemberIds.has(user.id))
  );

  const engLeadUsers = users.filter((user) => user.role === UserRole.ENG_LEAD);

  /**
   * Check if a status ID is a terminal status (completed or cancelled)
   */
  const isTerminalStatus = useCallback(
    (statusId: string): boolean => {
      const groups =
        ticket?.project?.statusConfig?.groups ?? DEFAULT_STATUS_GROUPS;
      return (
        groups.completed.includes(statusId) ||
        groups.cancelled.includes(statusId)
      );
    },
    [ticket?.project?.statusConfig?.groups]
  );

  const executeStatusUpdate = async (
    newStatus: string,
    resolution?: string
  ) => {
    if (!ticket?.id) return;
    try {
      await updateStatus.mutateAsync({
        id: asTicketId(ticket.ticketId),
        status: newStatus,
        resolution,
      });
      translatedToast.success('toast.success.statusUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'status' });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket?.id) return;

    if (isTerminalStatus(newStatus)) {
      setPendingStatus(newStatus);
      setResolutionDialogOpen(true);
      return;
    }

    await executeStatusUpdate(newStatus);
  };

  const handleResolutionSubmit = async (resolution: string) => {
    if (!pendingStatus) return;
    setResolutionDialogOpen(false);
    await executeStatusUpdate(pendingStatus, resolution);
    setPendingStatus(null);
  };

  const handleResolutionSkip = async () => {
    if (!pendingStatus) return;
    setResolutionDialogOpen(false);
    await executeStatusUpdate(pendingStatus);
    setPendingStatus(null);
  };

  const handleResolutionClose = () => {
    setResolutionDialogOpen(false);
    setPendingStatus(null);
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket?.id) return;
    try {
      await updatePriority.mutateAsync({
        id: asTicketId(ticket.ticketId),
        priority: newPriority,
      });
      translatedToast.success('toast.success.priorityUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'priority' });
    }
  };

  const handleCategoryChange = async (newCategory: string) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { category: newCategory as TicketCategory },
      });
      translatedToast.success('toast.success.categoryUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'category' });
    }
  };

  const handleAssigneeChange = async (userId: string | string[]) => {
    if (!ticket?.id) return;
    const developerId = Array.isArray(userId) ? userId[0] : userId;

    if (!developerId) {
      try {
        await updateTicket.mutateAsync({
          id: asTicketId(ticket.ticketId),
          data: { assignedTo: null },
        });
        translatedToast.success('toast.success.assigneeUpdated');
      } catch {
        translatedToast.error('toast.error.failedToUpdate', {
          item: 'assignee',
        });
      }
      return;
    }

    assignTicket.mutate(
      {
        id: asTicketId(ticket.ticketId),
        developerId: asUserId(developerId),
      },
      {
        onSuccess: () =>
          translatedToast.success('toast.success.assigneeUpdated'),
        onError: () =>
          translatedToast.error('toast.error.failedToUpdate', {
            item: 'assignee',
          }),
      }
    );
  };

  const handleStartDateChange = async (date: string | null) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { startDate: date },
      });
      translatedToast.success('toast.success.startDateUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', {
        item: 'start date',
      });
    }
  };

  const handleDueDateChange = async (date: string | null) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { dueDate: date },
      });
      translatedToast.success('toast.success.dueDateUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'due date' });
    }
  };

  const handleTempSolutionDateChange = async (date: string | null) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { tempSolutionDate: date },
      });
      translatedToast.success('toast.success.tempSolutionDateUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', {
        item: 'temporary solution date',
      });
    }
  };

  const handleFinalSolutionDateChange = async (date: string | null) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { finalSolutionDate: date },
      });
      translatedToast.success('toast.success.finalSolutionDateUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', {
        item: 'final solution date',
      });
    }
  };

  const handleProjectChange = async (projectId: string) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { project: projectId || null },
      });
      translatedToast.success('toast.success.projectUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'project' });
    }
  };

  const handleEngLeadChange = async (userId: string | string[]) => {
    if (!ticket?.id) return;
    const engLeadId = Array.isArray(userId) ? userId[0] : userId;

    if (!engLeadId) {
      try {
        await updateTicket.mutateAsync({
          id: asTicketId(ticket.ticketId),
          data: { engLead: null },
        });
        translatedToast.success('toast.success.engLeadUpdated');
      } catch {
        translatedToast.error('toast.error.failedToUpdate', {
          item: 'Eng Lead',
        });
      }
      return;
    }

    assignEngLead.mutate(
      {
        id: asTicketId(ticket.ticketId),
        engLeadId: asUserId(engLeadId),
      },
      {
        onSuccess: () =>
          translatedToast.success('toast.success.engLeadUpdated'),
        onError: () =>
          translatedToast.error('toast.error.failedToUpdate', {
            item: 'Eng Lead',
          }),
      }
    );
  };

  return {
    canEditStatus,
    canEditPriority,
    canEditAssignee,
    canEditCategory,
    canEditDates,
    canEditSolutionDates,
    canEditProject,
    canEditEngLead,

    isStatusUpdating: updateStatus.isPending,
    isPriorityUpdating: updatePriority.isPending,
    isCategoryUpdating: updateTicket.isPending,
    isAssigneeUpdating: assignTicket.isPending,
    isEngLeadUpdating: assignEngLead.isPending,
    isDatesUpdating: updateTicket.isPending,
    isProjectUpdating: updateTicket.isPending,

    developerUsers,
    engLeadUsers,

    // Resolution dialog
    resolutionDialogOpen,
    onResolutionSubmit: handleResolutionSubmit,
    onResolutionSkip: handleResolutionSkip,
    onResolutionClose: handleResolutionClose,

    onStatusChange: handleStatusChange,
    onPriorityChange: handlePriorityChange,
    onCategoryChange: handleCategoryChange,
    onAssigneeChange: handleAssigneeChange,
    onStartDateChange: handleStartDateChange,
    onDueDateChange: handleDueDateChange,
    onTempSolutionDateChange: handleTempSolutionDateChange,
    onFinalSolutionDateChange: handleFinalSolutionDateChange,
    onProjectChange: handleProjectChange,
    onEngLeadChange: handleEngLeadChange,
  };
}
