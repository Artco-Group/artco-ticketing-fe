import { UserRole } from '@/types';
import type { User } from '@/types';

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
  return allowedRoles.includes(user.role);
}

/**
 * Type guard to check if a value is a valid UserRole
 */
export function isUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}
