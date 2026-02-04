import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePageHeaderContext } from './usePageHeaderContext';
import type { Tab } from '../TabBar';

interface UsePageHeaderTabsConfig {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  /** Must be memoized with useMemo to prevent infinite re-renders */
  actions?: ReactNode;
}

export function usePageHeaderTabs(config: UsePageHeaderTabsConfig) {
  const { setTabBarConfig } = usePageHeaderContext();
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  });

  const stableOnTabChange = useCallback((tabId: string) => {
    configRef.current.onTabChange(tabId);
  }, []);

  useLayoutEffect(() => {
    setTabBarConfig({
      tabs: config.tabs,
      activeTab: config.activeTab,
      onTabChange: stableOnTabChange,
      actions: config.actions,
    });

    return () => setTabBarConfig(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.activeTab, setTabBarConfig]);
}
