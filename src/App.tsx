import { BrowserRouter, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@shared/lib/query-client';
import { AuthProvider } from '@features/auth/context';
import { ErrorBoundary } from '@app/components';
import { allRoutes } from '@app/routes';
import { ToastProvider } from '@shared/components/ui';

/**
 * Main App component
 * Clean and maintainable - all routing logic is organized in dedicated modules
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <Routes>{allRoutes}</Routes>
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
