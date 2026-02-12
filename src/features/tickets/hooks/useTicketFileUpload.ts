import { useState } from 'react';
import { asTicketId } from '@/types';
import { useToast } from '@/shared/components/ui';
import {
  useUploadAttachments,
  useUploadScreenRecording,
  useDeleteAttachment,
  useDeleteScreenRecording,
} from '../api/tickets-api';

interface UseTicketFileUploadProps {
  ticketId?: string;
}

export function useTicketFileUpload({ ticketId }: UseTicketFileUploadProps) {
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [isScreenRecordingModalOpen, setIsScreenRecordingModalOpen] =
    useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const toast = useToast();

  const uploadAttachmentsMutation = useUploadAttachments();
  const uploadScreenRecordingMutation = useUploadScreenRecording();
  const deleteAttachmentMutation = useDeleteAttachment();
  const deleteScreenRecordingMutation = useDeleteScreenRecording();

  const openFileUploadModal = () => setIsFileUploadModalOpen(true);
  const openScreenRecordingModal = () => setIsScreenRecordingModalOpen(true);

  const closeFileUploadModal = () => {
    setIsFileUploadModalOpen(false);
    setPendingFiles([]);
  };

  const closeScreenRecordingModal = () => {
    setIsScreenRecordingModalOpen(false);
  };

  const handleUploadFiles = async () => {
    if (!pendingFiles.length || !ticketId) return;

    const formData = new FormData();
    pendingFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      await uploadAttachmentsMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        formData,
      });
      toast.success('Files uploaded successfully');
      setPendingFiles([]);
      setIsFileUploadModalOpen(false);
    } catch {
      toast.error('Failed to upload files');
    }
  };

  const handleScreenRecordingComplete = async (
    file: File | null,
    _duration: number
  ) => {
    if (!file) {
      return;
    }

    if (!ticketId) {
      toast.error('Cannot upload: ticket not found');
      return;
    }

    // Close modal immediately, upload continues in background
    setIsScreenRecordingModalOpen(false);

    const formData = new FormData();
    formData.append('screenRecording', file);

    try {
      await uploadScreenRecordingMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        formData,
      });
      toast.success('Screen recording uploaded successfully');
    } catch {
      toast.error('Failed to upload screen recording');
    }
  };

  const handleDeleteAttachment = async (attachmentIndex: number) => {
    if (!ticketId) return;

    try {
      await deleteAttachmentMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        attachmentIndex,
      });
      toast.success('Attachment deleted');
    } catch {
      toast.error('Failed to delete attachment');
    }
  };

  const handleDeleteScreenRecording = async () => {
    if (!ticketId) return;

    try {
      await deleteScreenRecordingMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
      });
      toast.success('Screen recording deleted');
    } catch {
      toast.error('Failed to delete screen recording');
    }
  };

  return {
    // Modal state
    isFileUploadModalOpen,
    isScreenRecordingModalOpen,
    pendingFiles,
    setPendingFiles,

    // Modal actions
    openFileUploadModal,
    openScreenRecordingModal,
    closeFileUploadModal,
    closeScreenRecordingModal,

    // Upload handlers
    handleUploadFiles,
    handleScreenRecordingComplete,
    handleDeleteAttachment,
    handleDeleteScreenRecording,

    // Loading states
    isUploadingFiles: uploadAttachmentsMutation.isPending,
    isUploadingScreenRecording: uploadScreenRecordingMutation.isPending,
    isDeletingAttachment: deleteAttachmentMutation.isPending,
    isDeletingScreenRecording: deleteScreenRecordingMutation.isPending,
  };
}
