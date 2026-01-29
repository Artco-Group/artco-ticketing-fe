import { Icon } from '../Icon';
import { Button } from '../button';
import { cn } from '@/lib/utils';

interface RetryableErrorProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
  className?: string;
}

/**
 * Inline error component with retry functionality.
 * Use when API requests fail and user can retry.
 *
 * @example
 * const { data, error, refetch, isRefetching } = useMyQuery();
 *
 * if (error) {
 *   return (
 *     <RetryableError
 *       message="Failed to load tickets"
 *       onRetry={refetch}
 *       retrying={isRefetching}
 *     />
 *   );
 * }
 */
export function RetryableError({
  title = 'Something went wrong',
  message = "We couldn't load this content. Please try again.",
  onRetry,
  retrying = false,
  className,
}: RetryableErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-[50vh] w-full flex-col items-center justify-center px-4 py-12 text-center',
        className
      )}
    >
      <div className="bg-error-100 mb-4 rounded-full p-3">
        <Icon name="info" size="xl" className="text-error-500" />
      </div>
      <h3 className="text-greyscale-900 mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-greyscale-500 mb-6 max-w-md min-w-[20rem] text-sm">
        {message}
      </p>
      <Button onClick={onRetry} loading={retrying}>
        {retrying ? 'Retrying...' : 'Try Again'}
      </Button>
    </div>
  );
}
