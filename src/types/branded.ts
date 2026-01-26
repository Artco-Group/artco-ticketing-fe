declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

export type TicketId = Brand<string, 'TicketId'>;
export type UserId = Brand<string, 'UserId'>;
export type CommentId = Brand<string, 'CommentId'>;
export type ProjectId = Brand<string, 'ProjectId'>;

// Helper functions to create branded IDs
export const asTicketId = (id: string) => id as TicketId;
export const asUserId = (id: string) => id as UserId;
export const asCommentId = (id: string) => id as CommentId;
export const asProjectId = (id: string) => id as ProjectId;
