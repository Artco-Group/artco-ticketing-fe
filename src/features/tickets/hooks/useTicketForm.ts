import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTicketSchema,
  type CreateTicketFormData,
} from '@artco-group/artco-ticketing-sync';

export type ScreenRecording = { file: File; duration: number } | null;

interface UseTicketFormOptions {
  onSubmit: (
    data: CreateTicketFormData,
    files: File[],
    screenRecording: ScreenRecording
  ) => void;
}

/**
 * Custom hook for ticket creation form logic.
 * Manages form state, file attachments, and screen recording.
 */
export function useTicketForm({ onSubmit }: UseTicketFormOptions) {
  const [files, setFiles] = useState<File[]>([]);
  const [screenRecording, setScreenRecording] = useState<ScreenRecording>(null);

  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      category: undefined,
      affectedModule: '',
      description: '',
      reproductionSteps: '',
      expectedResult: '',
      actualResult: '',
      priority: 'Low',
    },
  });

  const handleFormSubmit = (data: CreateTicketFormData) => {
    onSubmit(data, files, screenRecording);
  };

  const handleScreenRecordingChange = (file: File | null, duration: number) => {
    if (file) {
      setScreenRecording({ file, duration });
    } else {
      setScreenRecording(null);
    }
  };

  return {
    form,
    files,
    setFiles,
    screenRecording,
    handleScreenRecordingChange,
    handleFormSubmit: form.handleSubmit(handleFormSubmit),
  };
}
