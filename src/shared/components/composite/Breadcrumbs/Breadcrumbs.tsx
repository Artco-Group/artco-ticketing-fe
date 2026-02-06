import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-1">
              {isLast ? (
                <span
                  className="text-text-tertiary text-sm font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.href ?? ''}
                    className="text-text-placeholder hover:text-foreground text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                  <Icon
                    name="chevron-right"
                    size="sm"
                    className="text-muted-foreground"
                    aria-hidden="true"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
