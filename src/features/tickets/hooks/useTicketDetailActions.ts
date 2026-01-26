import { useState, useEffect } from 'react';
import type { Ticket } from '@artco-group/artco-ticketing-sync';
import { toast } from 'sonner';
import { fileAPI } from '../api/file-api';
import type { TicketId, UserId } from '@/types/branded';
import { asTicketId, asUserId } from '@/types/branded';

interface UseTicketDetailActionsOptions {
  ticket: Ticket | null;
  onStatusUpdate?: (ticketId: TicketId, status: string) => Promise<void>;
  onAssignTicket?: (ticketId: TicketId, developerId: UserId) => void;
}

/**
 * Custom hook for ticket detail actions.
 * Manages assignment, status updates, and file downloads.
 */
export function useTicketDetailActions({
  ticket,
  onStatusUpdate,
  onAssignTicket,
}: UseTicketDetailActionsOptions) {
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync selectedDeveloper when ticket.assignedTo changes
  useEffect(() => {
    if (ticket) {
      const assignedId =
        typeof ticket.assignedTo === 'string'
          ? ticket.assignedTo
          : ticket.assignedTo?._id || '';
      setSelectedDeveloper(assignedId);
    }
  }, [ticket, ticket?.assignedTo]);

  const handleAssign = () => {
    if (!onAssignTicket || !ticket) return;
    const currentAssignedId =
      typeof ticket.assignedTo === 'string'
        ? ticket.assignedTo
        : ticket.assignedTo?._id || '';
    if (selectedDeveloper && selectedDeveloper !== currentAssignedId) {
      onAssignTicket(asTicketId(ticket._id || ''), asUserId(selectedDeveloper));
    }
  };

  const handleStatusAction = async (newStatus: string) => {
    if (!onStatusUpdate || !ticket) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(
        asTicketId(ticket.ticketId || ticket._id || ''),
        newStatus
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadAttachment = async (
    ticketId: TicketId,
    index: number,
    filename: string
  ) => {
    try {
      await fileAPI.downloadAttachment(ticketId, index, filename);
    } catch {
      toast.error('Failed to download file');
    }
  };

  const handleDownloadScreenRecording = async (
    ticketId: TicketId,
    filename: string
  ) => {
    try {
      await fileAPI.downloadScreenRecording(ticketId, filename);
    } catch {
      toast.error('Failed to download video');
    }
  };

  return {
    selectedDeveloper,
    setSelectedDeveloper,
    isUpdating,
    showSuccess,
    handleAssign,
    handleStatusAction,
    handleDownloadAttachment,
    handleDownloadScreenRecording,
  };
}
