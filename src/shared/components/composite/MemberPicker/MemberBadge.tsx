import { type User, getInitials } from '@artco-group/artco-ticketing-sync';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Icon,
} from '@/shared/components/ui';

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
      <Avatar className="h-4 w-4">
        <AvatarFallback className="text-[0.5rem]">
          {getInitials(user.name || '')}
        </AvatarFallback>
      </Avatar>
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
