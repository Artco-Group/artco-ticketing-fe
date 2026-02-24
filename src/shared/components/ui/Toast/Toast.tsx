/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '../Icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

const toastVariants = cva(
  'flex items-center h-11 w-fit px-lg gap-sm bg-black/[0.98] rounded-lg transition-all duration-200',
  {
    variants: {
      type: {
        success: '',
        error: '',
        warning: '',
        info: '',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  }
);

const iconColorMap: Record<ToastType, string> = {
  success: 'text-icon-success',
  error: 'text-icon-danger-secondary',
  warning: 'text-icon-notive',
  info: 'text-icon-core',
};

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  icon?: IconName;
  onClose: (id: string) => void;
  isExiting?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      type = 'info',
      title,
      message: _message,
      duration = 5000,
      icon,
      onClose,
      isExiting,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (duration === 0) return;

      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={type === 'error' ? 'assertive' : 'polite'}
        className={cn(
          toastVariants({ type }),
          'animate-in slide-in-from-right-full fade-in-0',
          isExiting && 'animate-out slide-out-to-right-full fade-out-0'
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'flex items-center justify-center [&_svg]:fill-current',
              iconColorMap[type]
            )}
          >
            <Icon name={icon} size="sm" />
          </span>
        )}
        <span className="text-body-sm text-greyscale-100 tracking-[-0.5px]">
          {title}
        </span>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast, toastVariants };
