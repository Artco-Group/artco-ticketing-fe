import {
  asTicketId,
  asUserId,
  type Ticket,
  type User,
  UserRole,
} from '@/types';
import { TicketCategory } from '@artco-group/artco-ticketing-sync';
import { useToast } from '@/shared/components/ui';
import {
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useAssignTicket,
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
  const toast = useToast();

  const updateStatus = useUpdateTicketStatus();
  const updatePriority = useUpdateTicketPriority();
  const assignTicket = useAssignTicket();
  const updateTicket = useUpdateTicket();

  const canManage = isEngLead || isAdmin;
  const canEditStatus = !isClient;
  const canEditPriority = canManage;
  const canEditAssignee = canManage;
  const canEditCategory = canManage;
  const canEditDates = canManage;
  const canEditProject = canManage;
  const canEditEngLead = isAdmin;

  const developerUsers = users.filter(
    (user) => user.role === UserRole.DEVELOPER
  );

  const engLeadUsers = users.filter((user) => user.role === UserRole.ENG_LEAD);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket?.id) return;
    try {
      await updateStatus.mutateAsync({
        id: asTicketId(ticket.ticketId),
        status: newStatus,
      });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket?.id) return;
    try {
      await updatePriority.mutateAsync({
        id: asTicketId(ticket.ticketId),
        priority: newPriority,
      });
      toast.success('Priority updated');
    } catch {
      toast.error('Failed to update priority');
    }
  };

  const handleCategoryChange = async (newCategory: string) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { category: newCategory as TicketCategory },
      });
      toast.success('Category updated');
    } catch {
      toast.error('Failed to update category');
    }
  };

  const handleAssigneeChange = (userId: string | string[]) => {
    if (!ticket?.id) return;
    const developerId = Array.isArray(userId) ? userId[0] : userId;
    if (!developerId) return;

    assignTicket.mutate(
      {
        id: asTicketId(ticket.ticketId),
        developerId: asUserId(developerId),
      },
      {
        onSuccess: () => toast.success('Assignee updated'),
        onError: () => toast.error('Failed to update assignee'),
      }
    );
  };

  const handleStartDateChange = async (date: string | null) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { startDate: date || undefined },
      });
      toast.success('Start date updated');
    } catch {
      toast.error('Failed to update start date');
    }
  };

  const handleDueDateChange = async (date: string | null) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { dueDate: date || undefined },
      });
      toast.success('Due date updated');
    } catch {
      toast.error('Failed to update due date');
    }
  };

  const handleProjectChange = async (projectId: string) => {
    if (!ticket?.id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket.ticketId),
        data: { project: projectId || null },
      });
      toast.success('Project updated');
    } catch {
      toast.error('Failed to update project');
    }
  };

  const handleEngLeadChange = async (_userId: string) => {
    toast.info('Eng Lead is managed through the project settings');
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
