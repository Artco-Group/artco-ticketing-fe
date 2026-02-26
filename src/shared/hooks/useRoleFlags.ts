import { useMemo } from 'react';
import { UserRole } from '@/types';

interface RoleFlags {
  isAdmin: boolean;
  isEngLead: boolean;
  isDeveloper: boolean;
  isProjectManager: boolean;
  isTechnician: boolean;
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
 * const { isAdmin, isEngLead, isDeveloper, isProjectManager, isTechnician, isClient } = useRoleFlags(user?.role);
 */
export function useRoleFlags(userRole?: string): RoleFlags {
  return useMemo(
    () => ({
      isAdmin: userRole === UserRole.ADMIN,
      isEngLead: userRole === UserRole.ENG_LEAD || userRole === UserRole.ADMIN,
      isDeveloper: userRole === UserRole.DEVELOPER,
      isProjectManager: userRole === UserRole.PROJECT_MANAGER,
      isTechnician: userRole === UserRole.TECHNICIAN,
      isClient: userRole === UserRole.CLIENT,
    }),
    [userRole]
  );
}
