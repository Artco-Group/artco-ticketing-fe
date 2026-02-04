import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/shared/components/ui/Icon/Icon';

export interface Tab {
  id: string;
  label: string;
  icon?: IconName;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  actions?: ReactNode;
  className?: string;
}

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  actions,
  className,
}: TabBarProps) {
  return (
    <div
      className={cn(
        'border-border-default flex items-center justify-between border-b',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-background-light-secondary text-text-primary border-border-selected'
                  : 'text-text-secondary border-border-default hover:bg-background-light-secondary'
              )}
            >
              {tab.icon && (
                <Icon
                  name={tab.icon}
                  size="sm"
                  className={
                    isActive ? 'text-icon-primary' : 'text-icon-secondary'
                  }
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
