import api from './axiosConfig';

export const ticketAPI = {
  getTickets: () => api.get('/tickets'),
  getTicket: (ticketId) => api.get(`/tickets/${ticketId}`),
  createTicket: (ticket) => api.post('/tickets', ticket),
  updateTicket: (ticketId, ticket) => api.put(`/tickets/${ticketId}`, ticket),
  updateTicketStatus: (ticketId, status) =>
    api.patch(`/tickets/${ticketId}/status`, { status }),
  updateTicketAssignee: (ticketId, developerId) =>
    api.patch(`/tickets/${ticketId}/assign`, { developerId }),
  updateTicketPriority: (ticketId, priority) =>
    api.patch(`/tickets/${ticketId}/priority`, { priority }),
  deleteTicket: (ticketId) => api.delete(`/tickets/${ticketId}`),
};
