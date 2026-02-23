import { Badge, Button, Icon } from '@/shared/components/ui';
import { CompanyLogo } from '../CompanyLogo';

interface ProjectBadgeProps {
  name: string;
  clientName?: string;
  clientAvatar?: string | null;
  disabled?: boolean;
  onRemove: () => void;
}

export function ProjectBadge({
  name,
  clientName,
  clientAvatar,
  disabled = false,
  onRemove,
}: ProjectBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <CompanyLogo
        fallback={clientName || name}
        src={clientAvatar}
        alt={clientName || name}
        size="xs"
        className="h-4 w-4"
      />
      <span className="text-xs">{name}</span>
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
