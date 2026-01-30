import type { User } from '@artco-group/artco-ticketing-sync';
import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Icon,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/components/ui';

export interface MemberPickerProps {
  /** Currently selected user ID(s) */
  value?: string | string[];
  /** Available users to select from */
  options: User[];
  /** Enable multi-select mode */
  multiple?: boolean;
  /** Change handler */
  onChange: (value: string | string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get user initials from name
 */
function getUserInitials(name: string | undefined): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * MemberPicker - Dropdown to select user(s) with avatar display
 *
 * @example
 * // Single select
 * <MemberPicker
 *   value={selectedUserId}
 *   options={users}
 *   onChange={setSelectedUserId}
 * />
 *
 * @example
 * // Multi select
 * <MemberPicker
 *   value={selectedUserIds}
 *   options={users}
 *   multiple
 *   onChange={setSelectedUserIds}
 * />
 */
export function MemberPicker({
  value,
  options,
  multiple = false,
  onChange,
  placeholder = 'Select member...',
  disabled = false,
  className,
}: MemberPickerProps) {
  // Filter out users without _id
  const validUsers = options.filter((user) => user._id);

  // Handle multi-select mode
  if (multiple) {
    const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
    const selectedUsers = validUsers.filter((user) =>
      selectedIds.includes(user._id!)
    );

    const handleToggle = (userId: string) => {
      const newValue = selectedIds.includes(userId)
        ? selectedIds.filter((id) => id !== userId)
        : [...selectedIds, userId];
      onChange(newValue);
    };

    const handleRemove = (userId: string) => {
      const newValue = selectedIds.filter((id) => id !== userId);
      onChange(newValue);
    };

    return (
      <div className={cn(className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-auto min-h-[2.25rem] w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              selectedUsers.length > 0 && 'py-1'
            )}
            disabled={disabled}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1">
              {selectedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedUsers.map((user) => (
                    <Badge
                      key={user._id!}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[0.5rem]">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user.name}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!disabled) handleRemove(user._id!);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!disabled) handleRemove(user._id!);
                          }
                        }}
                        className="hover:bg-muted ml-0.5 cursor-pointer rounded-full p-0.5 transition-colors"
                      >
                        <Icon name="close" size="xs" />
                      </span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="ml-2 flex shrink-0 items-center gap-1">
              <span className="text-muted-foreground text-sm font-medium">
                Member
              </span>
              <Icon name="chevron-down" size="md" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            {validUsers.map((user) => {
              const isSelected = selectedIds.includes(user._id!);
              return (
                <DropdownMenuItem
                  key={user._id!}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleToggle(user._id!);
                  }}
                >
                  <div className="flex flex-1 items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Icon
                      name="check"
                      size="sm"
                      className="text-primary ml-auto"
                    />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Single select mode
  const selectedValue = Array.isArray(value) ? value[0] : value;
  const selectedUser = validUsers.find((user) => user._id === selectedValue);

  const handleSelect = (userId: string) => {
    // Toggle - if already selected, deselect
    onChange(selectedValue === userId ? '' : userId);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          {selectedUser ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Badge variant="secondary" className="gap-1 pr-1">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[0.5rem]">
                    {getUserInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{selectedUser.name}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!disabled) handleClear();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!disabled) handleClear();
                    }
                  }}
                  className="hover:bg-muted ml-0.5 cursor-pointer rounded-full p-0.5 transition-colors"
                >
                  <Icon name="close" size="xs" />
                </span>
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground flex-1 text-left">
              {placeholder}
            </span>
          )}
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <span className="text-muted-foreground text-sm font-medium">
              Member
            </span>
            <Icon name="chevron-down" size="md" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          {validUsers.map((user) => {
            const isSelected = user._id === selectedValue;
            return (
              <DropdownMenuItem
                key={user._id!}
                onSelect={() => handleSelect(user._id!)}
              >
                <div className="flex flex-1 items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Icon
                    name="check"
                    size="sm"
                    className="text-primary ml-auto"
                  />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
