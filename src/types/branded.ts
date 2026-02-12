declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

export type TicketId = Brand<string, 'TicketId'>;
export type UserId = Brand<string, 'UserId'>;
export type CommentId = Brand<string, 'CommentId'>;
export type ProjectId = Brand<string, 'ProjectId'>;
export type SubtaskId = Brand<string, 'SubtaskId'>;

type BrandedString = string | undefined | null;

export const asTicketId = (id: BrandedString) => (id ?? '') as TicketId;
export const asUserId = (id: BrandedString) => (id ?? '') as UserId;
export const asCommentId = (id: BrandedString) => (id ?? '') as CommentId;
export const asProjectId = (id: BrandedString) => (id ?? '') as ProjectId;
export const asSubtaskId = (id: BrandedString) => (id ?? '') as SubtaskId;
