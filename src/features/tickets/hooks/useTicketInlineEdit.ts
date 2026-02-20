import {
  asTicketId,
  asUserId,
  type Ticket,
  type User,
  UserRole,
} from '@/types';
import { TicketCategory } from '@artco-group/artco-ticketing-sync';
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
}: UseTicketInlineEditProps) {
  const translatedToast = useTranslatedToast();

  const updateStatus = useUpdateTicketStatus();
  const updatePriority = useUpdateTicketPriority();
  const assignTicket = useAssignTicket();
  const assignEngLead = useAssignEngLead();
  const updateTicket = useUpdateTicket();

  const canManage = isEngLead || isAdmin;
  const canEditStatus = !isClient;
  const canEditPriority = canManage;
  const canEditAssignee = canManage;
  const canEditCategory = canManage;
  const canEditDates = canManage;
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

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket?.id) return;
    try {
      await updateStatus.mutateAsync({
        id: asTicketId(ticket.ticketId),
        status: newStatus,
      });
      translatedToast.success('toast.success.statusUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'status' });
    }
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

    onStatusChange: handleStatusChange,
    onPriorityChange: handlePriorityChange,
    onCategoryChange: handleCategoryChange,
    onAssigneeChange: handleAssigneeChange,
    onStartDateChange: handleStartDateChange,
    onDueDateChange: handleDueDateChange,
    onProjectChange: handleProjectChange,
    onEngLeadChange: handleEngLeadChange,
  };
}
