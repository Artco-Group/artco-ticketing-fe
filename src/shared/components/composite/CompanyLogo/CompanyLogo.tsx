import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/shared/components/ui/Tooltip';

/** Size variants aligned with design system (Avatar / spacing scale) */
export type CompanyLogoSize = 'xs' | 'sm' | 'md' | 'lg';

/** Shape variants for the logo container */
export type CompanyLogoVariant = 'circle' | 'rounded';

export interface CompanyLogoProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt'
> {
  /** Logo image URL. When missing or on error, fallback is shown. */
  src?: string | null;
  /** Alt text for the image. */
  alt: string;
  /** Size: sm (32px), md (40px), lg (48px). */
  size?: CompanyLogoSize;
  /** Shape variant: 'circle' (default) or 'rounded' (rounded square). */
  variant?: CompanyLogoVariant;
  /** Fallback initials shown in a colored circle when no image (e.g. "AB" for Acme Corp). */
  fallback: string;
  /** Optional index into design-system fallback colors (0–N). When set, overrides hash-based color. */
  colorIndex?: number;
  /** Optional tooltip text shown on hover. */
  tooltip?: string;
}

const sizeClasses: Record<CompanyLogoSize, { root: string; text: string }> = {
  xs: { root: 'h-6 w-6', text: 'text-xs' },
  sm: { root: 'h-8 w-8', text: 'text-xs' },
  md: { root: 'h-10 w-10', text: 'text-sm' },
  lg: { root: 'h-12 w-12', text: 'text-base' },
};

const FALLBACK_BG_CLASSES = [
  'bg-teal-600',
  'bg-violet-600',
  'bg-purple-600',
  'bg-green-600',
  'bg-blue-600',
  'bg-teal-700',
  'bg-violet-700',
  'bg-purple-700',
  'bg-green-700',
  'bg-orange-500',
  'bg-orange-600',
  'bg-pink-600',
  'bg-pink-700',
  'bg-blue-700',
  'bg-red-600',
  'bg-red-700',
  'bg-emerald-600',
  'bg-amber-500',
  'bg-sky-600',
] as const;

function getFallbackBg(fallback: string): (typeof FALLBACK_BG_CLASSES)[number] {
  let hash = 0;
  for (let i = 0; i < fallback.length; i++) {
    hash = ((hash << 5) - hash + fallback.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % FALLBACK_BG_CLASSES.length;
  return FALLBACK_BG_CLASSES[index];
}

export const CompanyLogo = React.forwardRef<HTMLDivElement, CompanyLogoProps>(
  (
    {
      src,
      alt,
      size = 'md',
      variant = 'circle',
      fallback,
      colorIndex,
      tooltip,
      className,
      ...imgProps
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const showFallback = !src || imageError;
    const sizes = sizeClasses[size];
    const fallbackBg =
      colorIndex !== undefined
        ? FALLBACK_BG_CLASSES[Math.abs(colorIndex) % FALLBACK_BG_CLASSES.length]
        : getFallbackBg(fallback);
    const initials = fallback.trim().slice(0, 2).toUpperCase() || '?';
    const borderRadius = variant === 'circle' ? 'rounded-full' : 'rounded-md';

    const logoElement = (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden',
          borderRadius,
          sizes.root,
          className
        )}
        role="img"
        aria-label={alt}
      >
        {!showFallback ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
            {...imgProps}
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center font-medium text-white',
              borderRadius,
              sizes.text,
              fallbackBg
            )}
          >
            {initials}
          </div>
        )}
      </div>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip}>
          <span>{logoElement}</span>
        </Tooltip>
      );
    }

    return logoElement;
  }
);
CompanyLogo.displayName = 'CompanyLogo';
