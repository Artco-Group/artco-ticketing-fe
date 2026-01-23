import { useNavigate } from 'react-router-dom';
import type { ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PAGE_ROUTES } from '@/shared/constants';

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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>

        {/* Error Message */}
        <p className="mb-6 text-center text-gray-600">
          We're sorry, but something unexpected happened. Please try one of the
          options below to continue.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-red-900">
              Error Details (Development Only):
            </h2>
            <p className="mb-2 font-mono text-xs text-red-800">
              {error.toString()}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-red-700">
                  Stack Trace
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-red-100 p-2 text-xs text-red-900">
                  {error.stack}
                </pre>
              </details>
            )}
            {errorInfo && errorInfo.componentStack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-red-700">
                  Component Stack
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-red-100 p-2 text-xs text-red-900">
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
            className="bg-brand-primary hover:bg-brand-primary-dark focus:ring-brand-primary rounded-lg px-6 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
