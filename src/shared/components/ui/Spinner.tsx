import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

/**
 * Reusable loading spinner component using Lucide icon
 */
export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <Loader2
      className={cn('text-primary animate-spin', sizeClasses[size], className)}
    />
  );
}

interface SpinnerContainerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Centered spinner with optional message, used for page/section loading states
 */
export function SpinnerContainer({
  message,
  size = 'md',
}: SpinnerContainerProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Spinner size={size} className="mx-auto" />
        {message && <p className="text-muted-foreground mt-4">{message}</p>}
      </div>
    </div>
  );
}
