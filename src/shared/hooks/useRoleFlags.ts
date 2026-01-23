import { useMemo } from 'react';
import { UserRole } from '@artco-group/artco-ticketing-sync';

interface RoleFlags {
  isAdmin: boolean;
  isEngLead: boolean;
  isDeveloper: boolean;
  isClient: boolean;
}

/**
 * Custom hook to derive role flags from a user role string.
 * Centralizes role checking logic to avoid repetition across components.
 * Admin role has all permissions, so isEngLead returns true for Admin users.
 *
 * @param userRole - The user's role string (from user.role)
 * @returns Object with boolean flags for each role type
 *
 * @example
 * const { isAdmin, isEngLead, isDeveloper, isClient } = useRoleFlags(user?.role);
 */
export function useRoleFlags(userRole?: string): RoleFlags {
  return useMemo(
    () => ({
      isAdmin: userRole === UserRole.ADMIN,
      isEngLead: userRole === UserRole.ENG_LEAD || userRole === UserRole.ADMIN,
      isDeveloper: userRole === UserRole.DEVELOPER,
      isClient: userRole === UserRole.CLIENT,
    }),
    [userRole]
  );
}
