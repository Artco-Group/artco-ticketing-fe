import { useContext } from 'react';
import { SettingsSidebarContext } from './SettingsSidebarContext';

export function useSettingsSidebar() {
  const context = useContext(SettingsSidebarContext);
  if (!context) {
    throw new Error(
      'useSettingsSidebar must be used within a SettingsSidebarProvider'
    );
  }
  return context;
}
