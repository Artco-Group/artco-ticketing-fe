import { useNavigate } from 'react-router-dom';
import type { ErrorInfo } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/components/ui';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  errorInfo,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;

  const handleGoHome = () => {
    resetErrorBoundary();
    navigate(PAGE_ROUTES.DASHBOARD.ROOT);
  };

  const handleGoBack = () => {
    resetErrorBoundary();
    navigate(-1);
  };

  const handleRetry = () => {
    resetErrorBoundary();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-error-100 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon name="info" size="xl" className="text-error-500" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-greyscale-900 mb-4 text-center text-2xl font-bold">
          Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-greyscale-600 mb-6 text-center">
          We're sorry, but something unexpected happened. Please try one of the
          options below to continue.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="bg-error-100 mb-6 rounded-lg border border-red-200 p-4">
            <h2 className="text-error-700 mb-2 text-sm font-semibold">
              Error Details (Development Only):
            </h2>
            <p className="text-error-600 mb-2 font-mono text-xs">
              {error.toString()}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  Stack Trace
                </summary>
                <pre className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs">
                  {error.stack}
                </pre>
              </details>
            )}
            {errorInfo && errorInfo.componentStack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  Component Stack
                </summary>
                <pre className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Recovery Options */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleRetry}
            className="btn-primary px-6 py-3 font-semibold"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="btn-secondary px-6 py-3 font-semibold"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="btn-secondary px-6 py-3 font-semibold"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-greyscale-500 text-sm">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
