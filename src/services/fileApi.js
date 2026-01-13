import api from './axiosConfig';

export const fileAPI = {
  downloadAttachment: async (ticketId, attachmentIndex, filename) => {
    try {
      const response = await api.get(
        `/tickets/${ticketId}/attachments/${attachmentIndex}`,
        {
          responseType: 'blob', // Important: tell axios to expect binary data
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download attachment:', error);
      throw error;
    }
  },

  downloadScreenRecording: async (ticketId, filename) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/screen-recording`, {
        responseType: 'blob', // Important: tell axios to expect binary data
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download screen recording:', error);
      throw error;
    }
  },
};
