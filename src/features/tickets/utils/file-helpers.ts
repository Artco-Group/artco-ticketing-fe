import type { CreateTicketFormData } from '@artco-group/artco-ticketing-sync';

/**
 * Creates a FormData object from ticket form data and files.
 * Centralizes the FormData construction logic for ticket creation.
 */
export function createTicketFormData(
  data: CreateTicketFormData,
  clientEmail: string,
  files: File[],
  screenRecording: { file: File; duration: number } | null
): FormData {
  const formData = new FormData();

  // Required fields
  formData.append('title', data.title);
  formData.append('clientEmail', clientEmail);
  formData.append('category', data.category);
  formData.append('description', data.description);

  // Optional fields
  if (data.affectedModule) {
    formData.append('affectedModule', data.affectedModule);
  }
  if (data.reproductionSteps) {
    formData.append('reproductionSteps', data.reproductionSteps);
  }
  if (data.expectedResult) {
    formData.append('expectedResult', data.expectedResult);
  }
  if (data.actualResult) {
    formData.append('actualResult', data.actualResult);
  }
  if (data.priority) {
    formData.append('priority', data.priority);
  }

  // File attachments
  files.forEach((file) => {
    formData.append('attachments', file);
  });

  // Screen recording
  if (screenRecording) {
    formData.append('screenRecording', screenRecording.file);
    formData.append('recordingDuration', String(screenRecording.duration));
  }

  return formData;
}
