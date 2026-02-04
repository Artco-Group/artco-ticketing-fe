import { useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  PageHeaderContext,
  type TabBarConfig,
  type FilterBarConfig,
} from './pageHeaderContext';

interface PageHeaderProviderProps {
  children: ReactNode;
}

export function PageHeaderProvider({ children }: PageHeaderProviderProps) {
  const [count, setCountState] = useState<number | undefined>(undefined);
  const [tabBarConfig, setTabBarConfigState] = useState<
    TabBarConfig | undefined
  >(undefined);
  const [filterBarConfig, setFilterBarConfigState] = useState<
    FilterBarConfig | undefined
  >(undefined);

  const setCount = useCallback((newCount: number | undefined) => {
    setCountState(newCount);
  }, []);

  const setTabBarConfig = useCallback((config: TabBarConfig | undefined) => {
    setTabBarConfigState(config);
  }, []);

  const setFilterBarConfig = useCallback(
    (config: FilterBarConfig | undefined) => {
      setFilterBarConfigState(config);
    },
    []
  );

  const value = useMemo(
    () => ({
      count,
      setCount,
      tabBarConfig,
      setTabBarConfig,
      filterBarConfig,
      setFilterBarConfig,
    }),
    [
      count,
      setCount,
      tabBarConfig,
      setTabBarConfig,
      filterBarConfig,
      setFilterBarConfig,
    ]
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}
