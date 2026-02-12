import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Icon } from './Icon';

export interface BulkAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  className?: string;
}

export function BulkActionsBar({
  selectedCount,
  actions,
  onClear,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
        'bg-background-light-secondary shadow-floating-bar flex items-center gap-3 rounded-xl px-3 py-2 backdrop-blur-sm',
        className
      )}
    >
      <span className="text-greyscale-700 flex items-center gap-2 text-sm font-medium">
        <span className="bg-greyscale-900 flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold text-white">
          {selectedCount}
        </span>
        selected
      </span>

      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={
              action.variant === 'destructive' ? 'destructive' : 'outline'
            }
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className="gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>

      <button
        onClick={onClear}
        className="text-greyscale-400 hover:bg-greyscale-100 hover:text-greyscale-600 ml-1 flex h-8 w-8 items-center justify-center rounded-full"
        aria-label="Clear selection"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
}

BulkActionsBar.displayName = 'BulkActionsBar';
