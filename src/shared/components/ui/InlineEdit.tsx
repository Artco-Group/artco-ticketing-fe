import { type ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

export interface InlineEditOption<T = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface InlineEditProps<T = string> {
  label: string;
  value: T;
  options: InlineEditOption<T>[];
  renderValue: (value: T) => ReactNode;
  renderOption?: (option: InlineEditOption<T>) => ReactNode;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (value: T) => void;
}

export function InlineEdit<T = string>({
  label,
  value,
  options,
  renderValue,
  renderOption,
  canEdit = true,
  isLoading = false,
  onChange,
}: InlineEditProps<T>) {
  const displayContent = renderValue(value);

  const defaultRenderOption = (option: InlineEditOption<T>) => (
    <>
      {option.icon}
      <span>{option.label}</span>
    </>
  );

  if (!canEdit) {
    return (
      <div className="flex h-8 items-center justify-start">
        <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
          {label}
        </span>
        <span className="select-none">{displayContent}</span>
      </div>
    );
  }

  return (
    <div className="flex h-8 items-center justify-start">
      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
        {label}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <button
            className={cn(
              'group -mx-1.5 -my-0.5 flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-left transition-all',
              'hover:bg-muted/60',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
          >
            {displayContent}
            <Icon
              name="chevron-down"
              size="xs"
              className="text-muted-foreground shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" sideOffset={4}>
          {options.map((option, index) => (
            <DropdownMenuItem
              key={String(option.value) || index}
              onClick={() => onChange(option.value)}
              className="flex cursor-pointer items-center gap-2"
            >
              {renderOption
                ? renderOption(option)
                : defaultRenderOption(option)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
