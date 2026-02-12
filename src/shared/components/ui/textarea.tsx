import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, required, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2.5">
        {label && (
          <label
            className={cn(
              'text-muted-foreground text-sm leading-none font-medium',
              error && 'text-destructive'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            'bg-component-input outline-border-default min-h-[100px] w-full rounded-lg px-3 py-3 shadow-[inset_0px_0px_0px_1px_rgba(238,239,241,1.00)] outline-1 -outline-offset-1',
            'text-text-secondary font-[Inter] text-sm leading-5 font-medium',
            'placeholder:text-text-placeholder placeholder:font-[Inter] placeholder:text-sm placeholder:leading-5 placeholder:font-medium',
            'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:-outline-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y transition-colors',
            error && 'outline-destructive focus-visible:outline-destructive',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={cn(
              'font-[Inter] text-xs leading-4 font-normal',
              error ? 'text-destructive font-medium' : 'text-text-tertiary'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
