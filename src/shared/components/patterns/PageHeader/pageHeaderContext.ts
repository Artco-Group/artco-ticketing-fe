import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { Tab } from '../TabBar';

export interface TabBarConfig {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  actions?: ReactNode;
}

export interface PageHeaderContextValue {
  count: number | undefined;
  setCount: (count: number | undefined) => void;
  tabBarConfig: TabBarConfig | undefined;
  setTabBarConfig: (config: TabBarConfig | undefined) => void;
}

export const PageHeaderContext = createContext<
  PageHeaderContextValue | undefined
>(undefined);
