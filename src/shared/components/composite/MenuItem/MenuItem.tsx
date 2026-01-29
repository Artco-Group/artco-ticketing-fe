import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/shared/components/ui';

export interface MenuItemProps {
  icon: IconName;

  label: string;

  active?: boolean;

  href?: string;

  badge?: number;

  onClick?: () => void;

  collapsed?: boolean;

  className?: string;
}

export function MenuItem({
  icon,
  label,
  active = false,
  href,
  badge,
  onClick,
  collapsed = false,
  className,
}: MenuItemProps) {
  const badgeLabel =
    badge && badge > 99 ? '99+' : badge && badge > 0 ? String(badge) : null;

  const baseClasses = cn(
    'flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
    'hover:bg-greyscale-200',
    active && 'bg-greyscale-100',
    collapsed && 'justify-center px-0',
    className
  );

  const content = (
    <>
      <Icon
        name={icon}
        size={collapsed ? 'lg' : 'xl'}
        className={cn(!collapsed && 'mr-3')}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {badgeLabel && !collapsed && (
        <span className="bg-destructive text-primary-foreground ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[0.7rem] leading-none font-semibold">
          {badgeLabel}
        </span>
      )}
      {active && !collapsed && (
        <div className="bg-sidebar-primary absolute top-0 left-0 h-full w-1 rounded-r" />
      )}
    </>
  );

  if (href) {
    return (
      <NavLink to={href} className={baseClasses}>
        {content}
      </NavLink>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
