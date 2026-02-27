import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'checked' | 'onCheckedChange'
> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      indeterminate,
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const handleCheckedChange = (value: boolean | 'indeterminate') => {
      if (onCheckedChange && typeof value === 'boolean') {
        onCheckedChange(value);
      }
    };

    // Determine the actual checked state for Radix
    const radixChecked = indeterminate ? 'indeterminate' : checked;

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer border-primary focus-visible:ring-ring h-4 w-4 shrink-0 rounded-sm border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
          'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary',
          className
        )}
        {...props}
        checked={radixChecked}
        onCheckedChange={handleCheckedChange}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          {indeterminate ? (
            <Icon name="minus" size="xs" />
          ) : (
            <Icon name="check-simple" size="xs" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (label) {
      return (
        <label
          className={cn(
            'flex cursor-pointer gap-2',
            description ? 'items-start' : 'items-center'
          )}
        >
          <span className={cn(description && 'mt-0.5')}>{checkboxElement}</span>
          <div>
            <span className="text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              {label}
            </span>
            {description && (
              <p className="text-muted-foreground mt-1 text-xs select-none">
                {description}
              </p>
            )}
          </div>
        </label>
      );
    }

    return checkboxElement;
  }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
