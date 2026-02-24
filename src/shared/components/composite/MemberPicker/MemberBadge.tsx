import type { User } from '@artco-group/artco-ticketing-sync';
import { Avatar, Badge, Icon } from '@/shared/components/ui';
import { cn } from '@/lib/utils';

interface MemberBadgeProps {
  user: User;
  disabled?: boolean;
  onRemove: () => void;
}

export function MemberBadge({
  user,
  disabled = false,
  onRemove,
}: MemberBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <Avatar
        src={user.profilePic}
        fallback={user.name || ''}
        size="sm"
        className="h-4 w-4"
      />
      <span className="text-xs">{user.name}</span>
      <span
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'hover:bg-muted ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-sm',
          disabled && 'pointer-events-none opacity-50'
        )}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) onRemove();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) onRemove();
          }
        }}
      >
        <Icon name="close" size="xs" />
      </span>
    </Badge>
  );
}
