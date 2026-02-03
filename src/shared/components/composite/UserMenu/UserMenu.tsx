import { useNavigate } from 'react-router-dom';

import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from '@/shared/components/ui';

export interface UserMenuUser {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface UserMenuProps {
  user: UserMenuUser;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:outline-none"
          aria-label="User menu"
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            fallback={user.name}
            size="md"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            {user.email && (
              <p className="text-muted-foreground text-xs">{user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(PAGE_ROUTES.PROFILE)}>
          <Icon name="user" size="sm" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(PAGE_ROUTES.SETTINGS)}>
          <Icon name="settings" size="sm" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive focus:text-destructive"
        >
          <Icon name="logout" size="sm" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
