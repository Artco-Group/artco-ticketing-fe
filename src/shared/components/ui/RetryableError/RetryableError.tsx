import { Icon } from '../Icon';
import { Button } from '../Button';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/shared/hooks';

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
  title,
  message,
  onRetry,
  retrying = false,
  className,
}: RetryableErrorProps) {
  const { translate } = useAppTranslation('common');

  const displayTitle = title ?? translate('errors.somethingWentWrong');
  const displayMessage = message ?? translate('errors.couldNotLoad');

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
      <h3 className="text-greyscale-900 mb-2 text-xl font-semibold">
        {displayTitle}
      </h3>
      <p className="text-greyscale-500 mb-6 max-w-md min-w-[20rem] text-sm">
        {displayMessage}
      </p>
      <Button onClick={onRetry} loading={retrying}>
        {retrying ? translate('errors.retrying') : translate('errors.tryAgain')}
      </Button>
    </div>
  );
}
