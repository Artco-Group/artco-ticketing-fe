import { BrowserRouter, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@shared/lib/query-client';
import { AuthProvider } from '@features/auth/context';
import { ErrorBoundary } from '@app/components';
import { allRoutes } from '@app/routes';
//import TestingPage from '@/shared/components/ui/TestingPage';

/**
 * Main App component
 * Clean and maintainable - all routing logic is organized in dedicated modules
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>{allRoutes}</Routes>
          </ErrorBoundary>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    //<TestingPage />
  );
}
