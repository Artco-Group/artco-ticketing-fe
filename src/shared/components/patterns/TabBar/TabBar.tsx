import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/Button';
import type { IconName } from '@/shared/components/ui/Icon/Icon';

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
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              leftIcon={tab.icon}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'rounded-lg border',
                isActive
                  ? 'bg-background-light-secondary text-text-primary border-border-selected'
                  : 'text-text-secondary border-border-default hover:bg-background-light-secondary'
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
