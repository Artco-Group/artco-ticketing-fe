import type { User } from '@artco-group/artco-ticketing-sync';
import { Avatar, DropdownMenuItem, Icon } from '@/shared/components/ui';

interface MemberOptionProps {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
}

export function MemberOption({
  user,
  isSelected,
  onSelect,
}: MemberOptionProps) {
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        onSelect();
      }}
    >
      <div className="flex flex-1 items-center gap-2">
        <Avatar
          src={user.profilePic}
          fallback={user.name || ''}
          size="sm"
          className="h-6 w-6"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      </div>
      {isSelected && (
        <Icon name="check" size="sm" className="text-primary ml-auto" />
      )}
    </DropdownMenuItem>
  );
}
