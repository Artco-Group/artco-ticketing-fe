import { useAuth } from '@/features/auth/context';
import { UserRole, UserRoleDisplay } from '@artco-group/artco-ticketing-sync';
import type { PageConfig } from '@/app/config/page-configs';
import {
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from '@/shared/components/ui';

interface HeaderProps {
  pageConfig?: PageConfig;
}

export function Header({ pageConfig }: HeaderProps) {
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card sticky top-0 z-10 flex h-16 shrink-0 border-b shadow-sm">
      <div className="flex flex-1 items-center justify-between px-4">
        {/* Page title from config */}
        <div className="flex items-center gap-3">
          {pageConfig?.title && (
            <h1 className="text-foreground text-lg font-semibold">
              {pageConfig.title}
            </h1>
          )}
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user?.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.email}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.role && UserRoleDisplay[user.role as UserRole]}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <Icon name="logout" size="md" className="mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
