import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Tooltip } from './Tooltip';

const avatarColors = [
  { bg: 'bg-teal-500', text: 'text-white' },
  { bg: 'bg-pink-500', text: 'text-white' },
  { bg: 'bg-violet-500', text: 'text-white' },
  { bg: 'bg-purple-500', text: 'text-white' },
  { bg: 'bg-green-500', text: 'text-white' },
  { bg: 'bg-blue-500', text: 'text-white' },
  { bg: 'bg-orange-500', text: 'text-white' },
];

function getColorFromName(name: string) {
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
        xl: 'h-12 w-12 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  tooltip?: string;
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size, className, tooltip }, ref) => {
    const [isLoading, setIsLoading] = React.useState(!!src);

    const name = fallback || alt || '';
    const color = React.useMemo(() => getColorFromName(name), [name]);

    const initials = React.useMemo(() => {
      if (!name) return '?';

      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }, [name]);

    const avatarElement = (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onLoadingStatusChange={(status) => {
              setIsLoading(status === 'loading');
            }}
          />
        )}
        <AvatarPrimitive.Fallback
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full font-medium',
            color.bg,
            color.text,
            isLoading && 'animate-pulse'
          )}
          delayMs={0}
        >
          {initials}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip}>
          <span>{avatarElement}</span>
        </Tooltip>
      );
    }

    return avatarElement;
  }
);
Avatar.displayName = 'Avatar';

const avatarGroupOverlap: Record<string, string> = {
  sm: '-space-x-1',
  md: '-space-x-1.5',
  lg: '-space-x-2',
  xl: '-space-x-2.5',
};

export interface AvatarGroupProps {
  avatars: Omit<AvatarProps, 'size'>[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 3, size = 'md', className }, ref) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          avatarGroupOverlap[size || 'md'],
          className
        )}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            {...avatar}
            size={size}
            className={cn('ring-background ring-2', avatar.className)}
          />
        ))}
        {remainingCount > 0 && (
          <span
            className={cn(
              avatarVariants({ size }),
              'bg-muted text-muted-foreground ring-background flex items-center justify-center font-medium ring-2'
            )}
            style={{ zIndex: visibleAvatars.length + 1 }}
          >
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
