import type { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

// Map variant names to SVG file paths (in public folder)
const illustrations = {
  'no-data': '/assets/empty-states/no-data.svg',
  'no-tickets': '/assets/empty-states/no-tickets.svg',
  'no-results': '/assets/empty-states/no-results.svg',
  'no-comments': '/assets/empty-states/no-comments.svg',
  'no-users': '/assets/empty-states/no-users.svg',
  error: '/assets/empty-states/error.svg',
  'no-notifications': '/assets/empty-states/no-notifications.svg',
  maintenance: '/assets/empty-states/maintenance.svg',
  success: '/assets/empty-states/success.svg',
  'coming-soon': '/assets/empty-states/coming-soon.svg',
} as const;

type Variant = keyof typeof illustrations;

interface EmptyStateProps {
  title: string;
  message: string;
  variant?: Variant;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Reusable empty/error state component for displaying centered messages
 *
 * @param variant - Auto-loads illustration from assets (e.g., 'no-tickets')
 * @param icon - Manual icon override (takes precedence over variant)
 * @param title - Main heading text
 * @param message - Descriptive message text
 * @param action - Optional action button or element
 * @param className - Additional CSS classes
 *
 * @example
 * // With variant (auto-loads SVG)
 * <EmptyState
 *   variant="no-tickets"
 *   title="No tickets found"
 *   message="There are no tickets matching your criteria"
 * />
 *
 * @example
 * // With custom icon
 * <EmptyState
 *   icon={<CustomIcon />}
 *   title="Custom state"
 *   message="Custom message"
 * />
 */
export function EmptyState({
  title,
  message,
  variant,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  const illustrationPath = !icon && variant ? illustrations[variant] : null;

  return (
    <div
      className={cn('flex min-h-[50vh] items-center justify-center', className)}
    >
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="pt-6 text-center">
          {illustrationPath && (
            <div className="mb-6 flex justify-center">
              <img
                src={illustrationPath}
                alt=""
                className="h-32 w-32"
                aria-hidden="true"
              />
            </div>
          )}
          {icon && <div className="mb-4 flex justify-center">{icon}</div>}

          <h1 className="text-foreground text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{message}</p>
          {action && <div className="mt-4">{action}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

export type { Variant as EmptyStateVariant };
