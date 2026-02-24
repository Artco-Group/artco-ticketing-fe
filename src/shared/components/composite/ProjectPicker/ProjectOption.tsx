import { DropdownMenuItem, Icon } from '@/shared/components/ui';
import { CompanyLogo } from '../CompanyLogo';

interface ProjectOptionProps {
  name: string;
  clientName?: string;
  clientAvatar?: string | null;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProjectOption({
  name,
  clientName,
  clientAvatar,
  isSelected,
  onSelect,
}: ProjectOptionProps) {
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        onSelect();
      }}
    >
      <div className="flex flex-1 items-center gap-2">
        <CompanyLogo
          fallback={clientName || name}
          src={clientAvatar}
          alt={clientName || name}
          size="sm"
          className="h-6 w-6"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          {clientName && (
            <span className="text-muted-foreground text-xs">{clientName}</span>
          )}
        </div>
      </div>
      {isSelected && (
        <Icon name="check" size="sm" className="text-primary ml-auto" />
      )}
    </DropdownMenuItem>
  );
}
