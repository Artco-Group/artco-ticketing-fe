import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { cn } from '@/lib/utils';

const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

export interface OTPInputProps {
  length: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const OTPSlot = ({
  index,
  error,
  isFirst,
  isLast,
}: {
  index: number;
  error?: boolean;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { slots } = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = slots[index];

  return (
    <div
      className={cn(
        'bg-component-input relative flex h-11 w-11 items-center justify-center',
        'border-border-default border',
        'text-text-secondary font-[Inter] text-sm leading-5 font-medium',
        'transition-colors',
        isFirst && 'rounded-l-lg',
        isLast && 'rounded-r-lg',
        !isFirst && '-ml-px',
        isActive && 'border-border-focus z-10',
        error && 'border-destructive',
        error && isActive && 'border-destructive'
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
};

const OTPInputComponent = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  OTPInputProps
>(({ length, value, error, onChange, label, className }, ref) => (
  <div className={cn('flex w-full flex-col gap-2', className)}>
    {label && (
      <label
        className={cn(
          'text-text-tertiary font-[Inter] text-xs leading-4 font-normal',
          error && 'text-destructive'
        )}
      >
        {label}
      </label>
    )}

    <OTPInput
      ref={ref}
      maxLength={length}
      value={value}
      onChange={onChange}
      containerClassName="flex items-center has-[:disabled]:opacity-50"
      className="disabled:cursor-not-allowed"
    >
      <InputOTPGroup>
        {Array.from({ length }, (_, i) => (
          <OTPSlot
            key={i}
            index={i}
            error={!!error}
            isFirst={i === 0}
            isLast={i === length - 1}
          />
        ))}
      </InputOTPGroup>
    </OTPInput>

    {error && (
      <p className="text-destructive font-[Inter] text-xs leading-4 font-medium">
        {error}
      </p>
    )}
  </div>
));
OTPInputComponent.displayName = 'OTPInput';

export { InputOTPGroup, OTPInputComponent as OTPInput };
