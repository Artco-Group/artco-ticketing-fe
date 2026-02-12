import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/Button';

export interface StatusHeaderProps {
  icon: ReactNode;
  label: string;
  onAdd?: () => void;
  className?: string;
}

export function StatusHeader({
  icon,
  label,
  onAdd,
  className,
}: StatusHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between border-b border-[#E6E6E6] bg-[#F5F5F5] px-4 py-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-text-primary text-sm font-medium">{label}</span>
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
