import type { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Reusable empty/error state component for displaying centered messages
 */
export function EmptyState({
  title,
  message,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex min-h-[50vh] items-center justify-center', className)}
    >
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="pt-6 text-center">
          {icon && <div className="mb-4 flex justify-center">{icon}</div>}
          <h1 className="text-foreground text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{message}</p>
          {action && <div className="mt-4">{action}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
