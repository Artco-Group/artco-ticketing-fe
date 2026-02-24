import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Tooltip } from './Tooltip';

const avatarColors = [
  { bg: 'bg-teal-400', text: 'text-white' },
  { bg: 'bg-pink-400', text: 'text-white' },
  { bg: 'bg-violet-400', text: 'text-white' },
  { bg: 'bg-purple-400', text: 'text-white' },
  { bg: 'bg-green-400', text: 'text-white' },
  { bg: 'bg-blue-400', text: 'text-white' },
  { bg: 'bg-orange-400', text: 'text-white' },
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

function Avatar({ src, alt, fallback, size, className, tooltip }: AvatarProps) {
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
      key={src || 'no-src'}
      className={cn(avatarVariants({ size }), className)}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full font-medium',
          color.bg,
          color.text
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

function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div
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
          tooltip={avatar.tooltip}
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

export { Avatar, AvatarGroup };
