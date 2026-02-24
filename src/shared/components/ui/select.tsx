import type { ComponentProps } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

const SelectField = SelectPrimitive.Root;

const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'bg-component-input outline-border-default flex h-11 w-full items-center justify-between overflow-hidden rounded-lg px-3 shadow-[inset_0px_0px_0px_1px_rgba(238,239,241,1.00)] outline-1 -outline-offset-1',
        'text-text-secondary font-[Inter] text-sm leading-5 font-medium',
        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:-outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors',
        '[&>span]:line-clamp-1',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon name="chevron-down" size="sm" className="text-icon-tertiary" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <Icon name="chevron-up" size="sm" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <Icon name="chevron-down" size="sm" />
    </SelectPrimitive.ScrollDownButton>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <span className="h-lg absolute right-2 flex w-lg items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon name="check-simple" size="sm" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  name?: string;
  className?: string;
  required?: boolean;
}

function Select({
  label,
  options,
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  disabled,
  error,
  helperText,
  name,
  className,
  required,
}: SelectProps) {
  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
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

      <SelectField
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          onBlur={onBlur}
          className={
            error
              ? 'outline-destructive focus-visible:outline-destructive'
              : undefined
          }
        >
          <SelectValue
            placeholder={placeholder}
            className="text-text-placeholder font-[Inter] text-sm leading-5 font-medium"
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectField>

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

export {
  Select,
  SelectField,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
