import type { Author } from '../user/Author';

export interface Comment {
  _id: string;
  text: string;
  authorId: Author;
  updatedAt: string;
  createdAt?: string;
}
