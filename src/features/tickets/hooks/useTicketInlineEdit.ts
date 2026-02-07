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
}: UseTicketInlineEditProps) {
  const toast = useToast();

  const updateStatus = useUpdateTicketStatus();
  const updatePriority = useUpdateTicketPriority();
  const assignTicket = useAssignTicket();
  const updateTicket = useUpdateTicket();

  const canEditStatus = !isClient;
  const canEditPriority = isEngLead;
  const canEditAssignee = isEngLead;
  const canEditCategory = isEngLead;

  const developerUsers = users.filter(
    (user) => user.role === UserRole.DEVELOPER
  );

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket?._id) return;
    try {
      await updateStatus.mutateAsync({
        id: asTicketId(ticket._id),
        status: newStatus,
      });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket?._id) return;
    try {
      await updatePriority.mutateAsync({
        id: asTicketId(ticket._id),
        priority: newPriority,
      });
      toast.success('Priority updated');
    } catch {
      toast.error('Failed to update priority');
    }
  };

  const handleCategoryChange = async (newCategory: string) => {
    if (!ticket?._id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket._id),
        data: { category: newCategory as TicketCategory },
      });
      toast.success('Category updated');
    } catch {
      toast.error('Failed to update category');
    }
  };

  const handleAssigneeChange = (userId: string | string[]) => {
    if (!ticket?._id) return;
    const developerId = Array.isArray(userId) ? userId[0] : userId;
    if (!developerId) return;

    assignTicket.mutate(
      {
        id: asTicketId(ticket._id),
        developerId: asUserId(developerId),
      },
      {
        onSuccess: () => toast.success('Assignee updated'),
        onError: () => toast.error('Failed to update assignee'),
      }
    );
  };

  return {
    canEditStatus,
    canEditPriority,
    canEditAssignee,
    canEditCategory,

    isStatusUpdating: updateStatus.isPending,
    isPriorityUpdating: updatePriority.isPending,
    isCategoryUpdating: updateTicket.isPending,
    isAssigneeUpdating: assignTicket.isPending,

    developerUsers,

    onStatusChange: handleStatusChange,
    onPriorityChange: handlePriorityChange,
    onCategoryChange: handleCategoryChange,
    onAssigneeChange: handleAssigneeChange,
  };
}
