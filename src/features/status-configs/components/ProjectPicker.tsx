import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Icon,
  Badge,
  Tooltip,
} from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';
import type { Project } from '@/types';

interface ProjectPickerProps {
  value: Set<string>;
  options: Project[];
  onChange: (projectId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disabledTooltip?: string;
}

export function ProjectPicker({
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  className,
  disabledTooltip,
}: ProjectPickerProps) {
  const { translate } = useAppTranslation('projects');

  const resolvedPlaceholder = placeholder ?? translate('picker.placeholder');
  const resolvedDisabledTooltip =
    disabledTooltip ?? translate('picker.disabledTooltip');

  const selectedProjects = useMemo(
    () => options.filter((project) => value.has(project.id)),
    [options, value]
  );

  const canSelectProject = (project: Project): boolean => {
    return (project.progress?.totalTickets ?? 0) === 0;
  };

  const handleRemove = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    onChange(projectId);
  };

  const renderProjectItem = (project: Project) => {
    const isSelected = value.has(project.id);
    const canSelect = canSelectProject(project);
    const ticketCount = project.progress?.totalTickets ?? 0;

    const item = (
      <DropdownMenuItem
        key={project.id}
        onClick={() => canSelect && onChange(project.id)}
        className={cn(
          'flex items-center gap-2',
          canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        )}
        disabled={!canSelect}
      >
        <div
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded border',
            isSelected
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-input'
          )}
        >
          {isSelected && <Icon name="check-simple" size="xs" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{project.name}</p>
            {!canSelect && ticketCount > 0 && (
              <span className="text-muted-foreground text-xs">
                ({ticketCount} {translate('picker.tickets')})
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-muted-foreground truncate text-xs">
              {project.description}
            </p>
          )}
        </div>
      </DropdownMenuItem>
    );

    if (!canSelect) {
      return (
        <Tooltip key={project.id} content={resolvedDisabledTooltip}>
          {item}
        </Tooltip>
      );
    }

    return item;
  };

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex min-h-[2.5rem] w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            selectedProjects.length > 0 && 'h-auto py-1.5'
          )}
          disabled={disabled}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {selectedProjects.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedProjects.map((project) => (
                  <Badge
                    key={project.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    <span className="max-w-[120px] truncate">
                      {project.name}
                    </span>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, project.id)}
                        className="hover:bg-muted rounded-sm p-0.5"
                      >
                        <Icon name="close" size="xs" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground flex-1 text-left">
                {resolvedPlaceholder}
              </span>
            )}
          </div>
          <Icon name="chevron-down" size="md" className="ml-2 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-h-[240px] w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          {options.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-sm">
              {translate('picker.noProjects')}
            </div>
          ) : (
            options.map(renderProjectItem)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
