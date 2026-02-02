import { useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Input } from '@/shared/components/ui';

export interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  value,
  placeholder = 'Search',
  onChange,
  onSubmit,
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      size="lg"
      leftIcon={<Icon name="search" size="sm" />}
      rightIcon={<Icon name="command-k" size="xxl" />}
      className={cn(
        'rounded-lg shadow-none placeholder:leading-5 placeholder:font-medium placeholder:tracking-[-0.28px]',
        className
      )}
    />
  );
}
