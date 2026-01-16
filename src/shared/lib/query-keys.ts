export const QueryKeys = {
  auth: {
    currentUser: () => ['auth', 'currentUser'] as const,
  },
  tickets: {
    all: () => ['tickets'] as const,
    lists: () => [...QueryKeys.tickets.all(), 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...QueryKeys.tickets.lists(), params] as const,
    details: () => [...QueryKeys.tickets.all(), 'detail'] as const,
    detail: (id: string) => [...QueryKeys.tickets.details(), id] as const,
  },
  comments: {
    all: () => ['comments'] as const,
    byTicket: (ticketId: string) =>
      [...QueryKeys.comments.all(), ticketId] as const,
  },
  users: {
    all: () => ['users'] as const,
    lists: () => [...QueryKeys.users.all(), 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...QueryKeys.users.lists(), params] as const,
    detail: (id: string) => [...QueryKeys.users.all(), 'detail', id] as const,
  },
};
