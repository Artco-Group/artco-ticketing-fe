import type { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { Spinner } from './Spinner';
import { cn } from '@/lib/utils';

export interface LoadingOverlayProps {
  isLoading?: boolean;
  message?: string;
  fullScreen?: boolean;
  zIndex?: number;
  children?: ReactNode;
}

export function LoadingOverlay({
  isLoading = true,
  message,
  fullScreen = true,
  zIndex = 9999,
  children,
}: LoadingOverlayProps = {}) {
  // Always render when used as Suspense fallback (isLoading defaults to true)
  // Only hide if explicitly set to false
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={cn(
        'animate-in fade-in flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0'
      )}
      style={{ zIndex, pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <Card className="animate-in fade-in zoom-in-95 duration-300">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <Spinner size="lg" />

          {message && (
            <p className="text-muted-foreground text-sm font-medium">
              {message}
            </p>
          )}

          {children}
        </CardContent>
      </Card>
    </div>
  );
}
