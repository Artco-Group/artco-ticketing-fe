import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Icon,
} from '@/shared/components/ui';
import { ProjectBadge } from './ProjectBadge';
import { ProjectOption } from './ProjectOption';

export interface ProjectPickerOption {
  id: string;
  name: string;
  clientName?: string;
  clientAvatar?: string | null;
}

export interface ProjectPickerProps {
  value?: string[];
  options: ProjectPickerOption[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function ProjectPicker({
  value = [],
  options,
  onChange,
  placeholder = 'Select projects...',
  disabled = false,
  className,
  label = 'Projects',
}: ProjectPickerProps) {
  const selectedIds = useMemo(() => value || [], [value]);

  const selectedProjects = useMemo(
    () => options.filter((project) => selectedIds.includes(project.id)),
    [options, selectedIds]
  );

  const handleOptionSelect = (projectId: string) => {
    const newValue = selectedIds.includes(projectId)
      ? selectedIds.filter((id) => id !== projectId)
      : [...selectedIds, projectId];
    onChange(newValue);
  };

  const handleRemoveBadge = (projectId: string) => {
    onChange(selectedIds.filter((id) => id !== projectId));
  };

  const triggerContent =
    selectedProjects.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {selectedProjects.map((project) => (
          <ProjectBadge
            key={project.id}
            name={project.name}
            clientName={project.clientName}
            clientAvatar={project.clientAvatar}
            disabled={disabled}
            onRemove={() => handleRemoveBadge(project.id)}
          />
        ))}
      </div>
    ) : (
      <span className="text-muted-foreground flex-1 text-left">
        {placeholder}
      </span>
    );

  const triggerClassName = cn(
    'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    'min-h-[2.25rem] h-auto',
    selectedProjects.length > 0 && 'py-1'
  );

  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)}>
      {label && (
        <label className="text-muted-foreground text-sm leading-none font-medium">
          {label}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClassName} disabled={disabled}>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {triggerContent}
          </div>
          <div className="ml-2 flex shrink-0 items-center">
            <Icon name="chevron-down" size="md" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          {options.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-sm">
              No projects available
            </div>
          ) : (
            options.map((project) => (
              <ProjectOption
                key={project.id}
                name={project.name}
                clientName={project.clientName}
                clientAvatar={project.clientAvatar}
                isSelected={selectedIds.includes(project.id)}
                onSelect={() => handleOptionSelect(project.id)}
              />
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
