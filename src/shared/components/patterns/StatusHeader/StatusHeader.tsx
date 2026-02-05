import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/Button';

export interface StatusHeaderProps {
  icon: ReactNode;
  label: string;
  count?: number;
  onAdd?: () => void;
  className?: string;
}

export function StatusHeader({
  icon,
  label,
  count,
  onAdd,
  className,
}: StatusHeaderProps) {
  return (
    <div
      className={cn(
        'border-border-default flex items-center justify-between border-b px-4 py-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-text-primary text-sm font-medium">{label}</span>
        {count !== undefined && (
          <span className="text-text-secondary text-xs">{count}</span>
        )}
      </div>

      {onAdd && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onAdd}
          leftIcon="plus"
          aria-label={`Add ${label}`}
          className="h-7 w-7"
        />
      )}
    </div>
  );
}
