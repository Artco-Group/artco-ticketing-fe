import api from '@/shared/lib/api-client';

export const ticketAPI = {
  getTickets: () => api.get('/tickets'),
  getTicket: (ticketId: string) => api.get(`/tickets/${ticketId}`),
  createTicket: (ticket: FormData) => api.post('/tickets', ticket),
  updateTicket: (ticketId: string, ticket: FormData) =>
    api.put(`/tickets/${ticketId}`, ticket),
  updateTicketStatus: (ticketId: string, status: string) =>
    api.patch(`/tickets/${ticketId}/status`, { status }),
  updateTicketAssignee: (ticketId: string, developerId: string) =>
    api.patch(`/tickets/${ticketId}/assign`, { developerId }),
  updateTicketPriority: (ticketId: string, priority: string) =>
    api.patch(`/tickets/${ticketId}/priority`, { priority }),
  deleteTicket: (ticketId: string) => api.delete(`/tickets/${ticketId}`),
};
