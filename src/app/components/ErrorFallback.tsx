import { useNavigate } from 'react-router-dom';
import type { ErrorInfo } from 'react';
import { createPortal } from 'react-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { Icon, Button } from '@/shared/components/ui';

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

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-50 p-4"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div
        className="rounded-lg bg-white p-8 shadow-lg"
        style={{ width: '100%', maxWidth: '42rem', minWidth: '320px' }}
      >
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
            <p className="text-error-600 mb-2 font-mono text-xs break-all">
              {error.toString()}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  Stack Trace
                </summary>
                <pre className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs break-all whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
            {errorInfo && errorInfo.componentStack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  Component Stack
                </summary>
                <pre className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs break-all whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Recovery Options */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleRetry} variant="default" size="lg">
            Try Again
          </Button>
          <Button onClick={handleGoBack} variant="outline" size="lg">
            Go Back
          </Button>
          <Button onClick={handleGoHome} variant="outline" size="lg">
            Go to Dashboard
          </Button>
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

  // Render via portal to escape any parent layout constraints
  return createPortal(content, document.body);
}
