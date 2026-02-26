import { useMemo } from 'react';
import { useAppTranslation } from './useAppTranslation';
import { hasRole } from '@/shared/utils/role-helpers';
import type {
  SidebarItem,
  SidebarFooterSection,
} from '@/shared/components/layout/Sidebar';
import {
  NAVIGATION,
  FOOTER_SECTIONS,
  NAV_LABEL_KEYS,
} from '@/shared/components/layout/sidebar.config';
import type { User } from '@/types';

export function useTranslatedNavigation(user: User | null | undefined) {
  const { translate } = useAppTranslation('common');

  const items = useMemo(
    () =>
      NAVIGATION.filter((item) => {
        if (!item.roles || !hasRole(user, item.roles)) return false;
        // Sub-clients only visible for parent clients with canCreateSubClients flag
        if (item.id === 'team') return !!user?.canCreateSubClients;
        return true;
      }).map((item) => ({
        ...item,
        label: NAV_LABEL_KEYS[item.id]
          ? translate(NAV_LABEL_KEYS[item.id])
          : item.label,
      })) as SidebarItem[],
    [user, translate]
  );

  const footerSections = useMemo(
    () =>
      FOOTER_SECTIONS.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          label: NAV_LABEL_KEYS[item.id]
            ? translate(NAV_LABEL_KEYS[item.id])
            : item.label,
        })),
      })) as SidebarFooterSection[],
    [translate]
  );

  const searchPlaceholder = translate('buttons.search');

  return {
    items,
    footerSections,
    searchPlaceholder,
  };
}
