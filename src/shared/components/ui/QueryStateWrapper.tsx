import type { ReactNode } from 'react';
import { SpinnerContainer } from './Spinner';
import { EmptyState } from './EmptyState';

interface QueryStateWrapperProps<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | undefined;
  children: (data: T) => ReactNode;

  // Customization
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;

  // Optional: Skip empty state check (for cases where empty data is valid)
  allowEmpty?: boolean;
  // Optional: Custom empty check (e.g., for arrays)
  isEmpty?: (data: T) => boolean;
}

/**
 * Wrapper component that handles loading, error, and empty states for React Query results.
 * Uses render props pattern to provide type-safe data access in children.
 *
 * @example
 * const { data, isLoading, error } = useUsers();
 *
 * return (
 *   <QueryStateWrapper
 *     isLoading={isLoading}
 *     error={error}
 *     data={data}
 *     loadingMessage="Loading users..."
 *     errorMessage="Failed to load users."
 *   >
 *     {(userData) => <UserList users={userData.users} />}
 *   </QueryStateWrapper>
 * );
 */
export function QueryStateWrapper<T>({
  isLoading,
  error,
  data,
  children,
  loadingMessage = 'Loading...',
  errorTitle = 'Error',
  errorMessage = 'Something went wrong. Please try again later.',
  emptyTitle = 'No Data',
  emptyMessage = 'No data available.',
  emptyAction,
  allowEmpty = false,
  isEmpty,
}: QueryStateWrapperProps<T>) {
  if (isLoading) {
    return <SpinnerContainer message={loadingMessage} />;
  }

  if (error) {
    return (
      <EmptyState variant="error" title={errorTitle} message={errorMessage} />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="no-data"
        title={emptyTitle}
        message={emptyMessage}
        action={emptyAction}
      />
    );
  }

  // Check custom empty condition (e.g., empty array)
  if (!allowEmpty && isEmpty?.(data)) {
    return (
      <EmptyState
        variant="no-data"
        title={emptyTitle}
        message={emptyMessage}
        action={emptyAction}
      />
    );
  }

  return <>{children(data)}</>;
}
