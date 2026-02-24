import api from '@/shared/lib/api-client';
import type { TicketId } from '@/types';

/**
 * Downloads a file from the given URL and triggers browser download
 */
async function downloadFile(url: string, filename: string): Promise<void> {
  const response = await api.get(url, { responseType: 'blob' });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }, 100);
}

export const fileAPI = {
  downloadAttachment: async (
    ticketId: TicketId,
    attachmentIndex: number,
    filename: string
  ): Promise<void> => {
    await downloadFile(
      `/tickets/${ticketId}/attachments/${attachmentIndex}`,
      filename
    );
  },

  downloadScreenRecording: async (
    ticketId: TicketId,
    recordingIndex: number,
    filename: string
  ): Promise<void> => {
    await downloadFile(
      `/tickets/${ticketId}/screen-recording/${recordingIndex}`,
      filename
    );
  },
};
