import { createContext } from 'react';

export interface SettingsSidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SettingsSidebarContext = createContext<
  SettingsSidebarContextType | undefined
>(undefined);
