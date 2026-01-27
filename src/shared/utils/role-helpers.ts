import { isUserRole } from '@artco-group/artco-ticketing-sync';
import { UserRole, type User } from '@/types';

/**
 * Type-safe function to check if a user has one of the allowed roles.
 * Admin role has access to everything.
 */
export function hasRole(
  user: User | null | undefined,
  allowedRoles: UserRole[]
): boolean {
  if (!user || !user.role) {
    return false;
  }
  if (!isUserRole(user.role)) {
    return false;
  }
  // Admin has access to everything
  if (user.role === UserRole.ADMIN) {
    return true;
  }
  return allowedRoles.includes(user.role);
}
