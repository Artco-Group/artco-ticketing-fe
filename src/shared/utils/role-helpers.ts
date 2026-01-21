import { UserRole } from '@artco-group/artco-ticketing-sync/enums';
import type { User } from '@artco-group/artco-ticketing-sync/types';
import { isUserRole } from '@artco-group/artco-ticketing-sync/utils';

/**
 * Type-safe function to check if a user has one of the allowed roles
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
  return allowedRoles.includes(user.role);
}
