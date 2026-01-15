import { UserRole } from '../common/enums';

export interface User {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  createdAt?: string;
}
