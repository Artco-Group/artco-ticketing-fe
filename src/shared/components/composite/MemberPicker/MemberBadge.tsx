import type { User } from '@artco-group/artco-ticketing-sync';
import { Avatar, Badge, Button, Icon } from '@/shared/components/ui';

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
      <Avatar fallback={user.name || ''} size="sm" className="h-4 w-4" />
      <span className="text-xs">{user.name}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-0.5 h-4 w-4 p-0"
        disabled={disabled}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) onRemove();
        }}
      >
        <Icon name="close" size="xs" />
      </Button>
    </Badge>
  );
}
