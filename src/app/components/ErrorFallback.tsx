import type { ErrorInfo } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { Icon, Button } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  errorInfo,
  resetErrorBoundary: _resetErrorBoundary,
}: ErrorFallbackProps) {
  const { translate } = useAppTranslation('common');
  const isDevelopment = import.meta.env.DEV;

  const handleGoHome = () => {
    window.location.href = PAGE_ROUTES.DASHBOARD.ROOT;
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-50 px-4 py-12"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div
        className="rounded-lg bg-white p-8 shadow-lg"
        style={{ width: '100%', maxWidth: '672px', minWidth: '320px' }}
      >
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-error-100 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon name="info" size="xl" className="text-error-500" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-greyscale-900 mb-4 text-center text-2xl font-bold">
          {translate('errors.somethingWentWrong')}
        </h1>

        {/* Error Message */}
        <p className="text-greyscale-600 mb-6 text-center">
          {translate('errors.unexpectedError')}
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="bg-error-100 mb-6 rounded-lg border border-red-200 p-4">
            <h2 className="text-error-700 mb-2 text-sm font-semibold">
              {translate('errors.errorDetails')}
            </h2>
            <p className="text-error-600 mb-2 font-mono text-xs break-words">
              {error.toString()}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  {translate('errors.stackTrace')}
                </summary>
                <pre className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs break-words whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
            {errorInfo && errorInfo.componentStack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  {translate('errors.componentStack')}
                </summary>
                <pre className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs break-words whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Recovery Options */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleRetry} variant="default" size="lg">
            {translate('errors.tryAgain')}
          </Button>
          <Button onClick={handleGoBack} variant="outline" size="lg">
            {translate('errors.goBack')}
          </Button>
          <Button onClick={handleGoHome} variant="outline" size="lg">
            {translate('errors.notFound.goToDashboard')}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-greyscale-500 text-sm">
            {translate('errors.contactSupport')}
          </p>
        </div>
      </div>
    </div>
  );
}
