import { useMemo } from 'react';
import {
  UserRole,
  UserRoleDisplay,
  UserRoleTranslationKeys,
  UserSortField,
  UserSortFieldTranslationKeys,
  INTERNAL_ROLES,
} from '@artco-group/artco-ticketing-sync';
import { useAppTranslation } from '@/shared/hooks';

interface UseUserFiltersProps {
  roleFilter: string;
  onFilterChange: (filterType: string, value: string) => void;
}

export function useUserFilters({
  roleFilter,
  onFilterChange,
}: UseUserFiltersProps) {
  const { translate } = useAppTranslation('users');

  const sortOptions = useMemo(
    () =>
      (Object.values(UserSortField) as UserSortField[]).map((field) => ({
        label: translate(UserSortFieldTranslationKeys[field]),
        value: field,
      })),
    [translate]
  );

  const groupByOptions = useMemo(
    () => [{ label: translate('form.role'), value: 'role' }],
    [translate]
  );

  const roleOptions = useMemo(
    () =>
      INTERNAL_ROLES.map((role) => ({
        value: UserRoleDisplay[role],
        label: translate(UserRoleTranslationKeys[role]),
      })),
    [translate]
  );

  const filterBarFilters = useMemo(
    () => [
      {
        id: 'role',
        label: translate('form.role'),
        icon: 'user' as const,
        options: roleOptions,
        value: roleFilter === 'All' ? null : roleFilter,
      },
    ],
    [roleFilter, roleOptions, translate]
  );

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    onFilterChange(filterId, value ?? 'All');
  };

  const handleSortChange = (value: string | null) => {
    onFilterChange('sortBy', value ?? UserSortField.NAME);
  };

  const getRoleLabel = (role: UserRole): string =>
    translate(UserRoleTranslationKeys[role]) || UserRoleDisplay[role];

  return {
    sortOptions,
    groupByOptions,
    filterBarFilters,
    roleOptions,
    handleFilterBarChange,
    handleSortChange,
    getRoleLabel,
  };
}
