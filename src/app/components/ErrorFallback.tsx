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
  resetErrorBoundary: _resetErrorBoundary,
}: ErrorFallbackProps) {
  const isDevelopment = import.meta.env.DEV;

  const handleGoHome = () => {
    // Full page reload to clear all state and navigate
    window.location.href = PAGE_ROUTES.DASHBOARD.ROOT;
  };

  const handleGoBack = () => {
    // Go back in browser history
    window.history.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12"
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
      }}
    >
      <div
        className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg"
        style={{
          width: '100%',
          maxWidth: '768px',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
        }}
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
            <p
              className="text-error-600 mb-2 font-mono text-xs"
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {error.toString()}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  Stack Trace
                </summary>
                <pre
                  className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {error.stack}
                </pre>
              </details>
            )}
            {errorInfo && errorInfo.componentStack && (
              <details className="mt-2">
                <summary className="text-error-700 cursor-pointer text-xs font-semibold">
                  Component Stack
                </summary>
                <pre
                  className="bg-error-100 text-error-700 mt-2 max-h-48 overflow-auto rounded p-2 font-mono text-xs"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
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
