import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden group',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500/20',
        secondary:
          'border border-greyscale-200 bg-greyscale-0 text-greyscale-700 hover:bg-greyscale-100 focus:ring-greyscale-300/20',
        destructive:
          'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500/20',
        ghost: 'text-greyscale-600 hover:bg-greyscale-100',
      },
      size: {
        sm: 'h-7 px-3 text-xs rounded-[6px]',
        md: 'h-9 px-4 text-sm rounded-[8px]',
        lg: 'h-11 px-6 text-base rounded-lg',
        icon: 'h-7 w-7 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Border color for pressed state - matches Figma design (#383838 = greyscale-700)
    const getBorderColor = () => {
      switch (variant) {
        case 'primary':
          return 'border-greyscale-700'; // Dark grey border (#383838) for pressed state
        case 'destructive':
          return 'border-greyscale-700'; // Dark grey border (#383838) for pressed state
        case 'secondary':
        case 'ghost':
          return 'border-greyscale-400';
        default:
          return 'border-greyscale-700';
      }
    };

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={isDisabled}
        className={buttonVariants({
          variant,
          size,
          className: props.className,
        })}
        {...props}
      >
        {/* Radial gradient from white to background color - visible in default and hover, fades out on press */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50.00%_49.43%_at_49.43%_-0.00%,_var(--effect-button-1,_rgba(245,245,245,0.40))_0%,_rgba(255,255,255,0)_100%)] transition-opacity duration-150 group-active:opacity-0 ${
            size === 'sm'
              ? 'rounded-[6px]'
              : size === 'md'
                ? 'rounded-[8px]'
                : 'rounded-lg'
          }`}
        />
        {/* Border appears on press with rounded corners, disappears on release */}
        <span
          className={`absolute inset-0 border ${getBorderColor()} opacity-0 transition-opacity duration-150 group-active:opacity-100 ${
            size === 'sm'
              ? 'rounded-[6px]'
              : size === 'md'
                ? 'rounded-[8px]'
                : 'rounded-lg'
          }`}
        />
        {/* Content */}
        <span className="relative inline-flex items-center gap-2">
          {loading && <Spinner size="sm" className="text-current" />}
          {!loading && leftIcon}
          {children}
          {!loading && rightIcon}
        </span>
      </button>
    );
  }
);
