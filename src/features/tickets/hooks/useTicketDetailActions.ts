import { useState, useEffect, useRef } from 'react';
import {
  asTicketId,
  asUserId,
  type Ticket,
  type TicketId,
  type UserId,
} from '@/types';
import { fileAPI } from '../api/file-api';
import { useTranslatedToast } from '@/shared/hooks';

interface UseTicketDetailActionsOptions {
  ticket: Ticket | null;
  onStatusUpdate?: (ticketId: TicketId, status: string) => Promise<void>;
  onAssignTicket?: (ticketId: TicketId, developerId: UserId) => void;
}

export function useTicketDetailActions({
  ticket,
  onStatusUpdate,
  onAssignTicket,
}: UseTicketDetailActionsOptions) {
  const translatedToast = useTranslatedToast();
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>(
    () => ticket?.assignedTo?.id || ''
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setSelectedDeveloper(ticket?.assignedTo?.id || '');
  }, [ticket?.assignedTo?.id]);

  const handleAssign = () => {
    if (!onAssignTicket || !ticket) return;
    const currentAssignedId = ticket.assignedTo?.id || '';
    if (selectedDeveloper && selectedDeveloper !== currentAssignedId) {
      onAssignTicket(
        asTicketId(ticket.ticketId || ''),
        asUserId(selectedDeveloper)
      );
    }
  };

  const handleStatusAction = async (newStatus: string) => {
    if (!onStatusUpdate || !ticket) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(asTicketId(ticket.ticketId || ticket.id), newStatus);
      setShowSuccess(true);
      successTimeoutRef.current = setTimeout(() => setShowSuccess(false), 3000);
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
      translatedToast.error('toast.error.failedToDownload', { item: 'file' });
    }
  };

  const handleDownloadScreenRecording = async (
    ticketId: TicketId,
    recordingIndex: number,
    filename: string
  ) => {
    try {
      await fileAPI.downloadScreenRecording(ticketId, recordingIndex, filename);
    } catch {
      translatedToast.error('toast.error.failedToDownload', { item: 'video' });
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
