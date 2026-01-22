// Import all SVG illustrations using Vite's glob import
const illustrations = import.meta.glob<string>(
  '../../../../assets/empty-states/*.svg',
  {
    eager: true,
    import: 'default',
  }
);

// Create a mapping from variant names to imported SVG paths
const variantIllustrations: Record<string, string> = Object.keys(
  illustrations
).reduce(
  (acc, path) => {
    // Extract filename without extension from path
    // e.g., '../../../../assets/empty-states/no-data.svg' -> 'no-data'
    const filename = path.split('/').pop()?.replace('.svg', '') || '';
    acc[filename] = illustrations[path];
    return acc;
  },
  {} as Record<string, string>
);

interface EmptyStateProps {
  variant?:
    | 'no-data'
    | 'no-tickets'
    | 'no-results'
    | 'no-comments'
    | 'no-users'
    | 'error'
    | 'no-notifications'
    | 'maintenance'
    | 'success'
    | 'coming-soon';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  variant = 'no-data',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const illustration = variantIllustrations[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <img
        src={illustration}
        alt=""
        className="mb-6 h-40 w-40"
        aria-hidden="true"
      />
      <h3 className="text-heading-h5 text-greyscale-900 mb-2">{title}</h3>
      {description && (
        <p className="text-body-sm text-greyscale-500 mb-6 max-w-sm text-center">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
