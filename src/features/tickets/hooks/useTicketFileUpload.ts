import { useState } from 'react';
import {
  VALIDATION_RULES,
  ALLOWED_FILE_TYPES,
} from '@artco-group/artco-ticketing-sync';
import { asTicketId } from '@/types';
import { useTranslatedToast } from '@/shared/hooks';
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
  const [deletingRecordingIndex, setDeletingRecordingIndex] = useState<
    number | null
  >(null);
  const [deletingAttachmentIndex, setDeletingAttachmentIndex] = useState<
    number | null
  >(null);
  const translatedToast = useTranslatedToast();

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

    for (const file of pendingFiles) {
      if (file.size > VALIDATION_RULES.FRONTEND_MAX_FILE_SIZE) {
        translatedToast.error('toast.error.fileTooLarge', {
          size: String(VALIDATION_RULES.FRONTEND_MAX_FILE_SIZE / (1024 * 1024)),
        });
        return;
      }
      if (!ALLOWED_FILE_TYPES.ATTACHMENTS.includes(file.type)) {
        translatedToast.error('toast.error.unsupportedFileType');
        return;
      }
    }

    const formData = new FormData();
    pendingFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      await uploadAttachmentsMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        formData,
      });
      translatedToast.success('toast.success.filesUploaded');
      setPendingFiles([]);
      setIsFileUploadModalOpen(false);
    } catch {
      translatedToast.error('toast.error.failedToUpload', { item: 'files' });
    }
  };

  const handleScreenRecordingComplete = async (
    file: File | null,
    duration: number
  ) => {
    if (!file) {
      return;
    }

    if (!ticketId) {
      translatedToast.error('toast.error.notFound', { item: 'Ticket' });
      return;
    }

    // Close modal immediately, upload continues in background
    setIsScreenRecordingModalOpen(false);

    const formData = new FormData();
    formData.append('screenRecording', file);
    formData.append('recordingDuration', String(Math.round(duration)));

    try {
      await uploadScreenRecordingMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        formData,
      });
      translatedToast.success('toast.success.recordingUploaded');
    } catch {
      translatedToast.error('toast.error.failedToUpload', {
        item: 'screen recording',
      });
    }
  };

  const handleDeleteAttachment = async (attachmentIndex: number) => {
    if (!ticketId || deletingAttachmentIndex !== null) return;

    setDeletingAttachmentIndex(attachmentIndex);
    try {
      await deleteAttachmentMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        attachmentIndex,
      });
      translatedToast.success('toast.success.attachmentDeleted');
    } catch {
      translatedToast.error('toast.error.failedToDelete', {
        item: 'attachment',
      });
    } finally {
      setDeletingAttachmentIndex(null);
    }
  };

  const handleDeleteScreenRecording = async (recordingIndex: number) => {
    if (!ticketId || deletingRecordingIndex !== null) return;

    setDeletingRecordingIndex(recordingIndex);
    try {
      await deleteScreenRecordingMutation.mutateAsync({
        ticketId: asTicketId(ticketId),
        recordingIndex,
      });
      translatedToast.success('toast.success.recordingDeleted');
    } catch {
      translatedToast.error('toast.error.failedToDelete', {
        item: 'screen recording',
      });
    } finally {
      setDeletingRecordingIndex(null);
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
    deletingAttachmentIndex,
    deletingRecordingIndex,
  };
}
