import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui/Input';
import { Icon } from '@/shared/components/ui/Icon';
import { StatusIcon } from '@/shared/components/ui/BadgeIcons';
import { Select } from '@/shared/components/ui/select';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import type {
  StatusDefinition,
  StatusColor,
} from '@artco-group/artco-ticketing-sync';
import { StatusColorToVariant } from '@artco-group/artco-ticketing-sync';
import { ColorSelect } from './ColorSelect';
import {
  getFillPercentForGroup,
  getGroupSelectOptions,
  type StatusGroupType,
} from '../utils/status-config-helpers';

interface SortableStatusItemProps {
  status: StatusDefinition;
  index: number;
  group: StatusGroupType;
  groupIndex: number;
  isInitial: boolean;
  totalStatuses: number;
  onNameChange: (index: number, name: string) => void;
  onColorChange: (index: number, color: StatusColor) => void;
  onGroupChange: (statusId: string, group: StatusGroupType) => void;
  onSetInitial: (statusId: string) => void;
  onRemove: (index: number) => void;
  translate: (key: string) => string;
}

export function SortableStatusItem({
  status,
  index,
  group,
  groupIndex,
  isInitial,
  totalStatuses,
  onNameChange,
  onColorChange,
  onGroupChange,
  onSetInitial,
  onRemove,
  translate,
}: SortableStatusItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const variant = StatusColorToVariant[status.color] || 'grey';

  const previewFillPercent = getFillPercentForGroup(group, groupIndex);
  const isDotted = group === 'backlog';

  const groupOptions = getGroupSelectOptions(translate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card flex items-center gap-3 rounded-lg border px-3 py-2.5',
        isInitial && 'ring-primary/40 ring-1',
        isDragging && 'shadow-md'
      )}
    >
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground shrink-0 cursor-grab p-0.5 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Icon name="grip" size="sm" />
      </button>

      <StatusIcon
        fillPercent={previewFillPercent}
        variant={variant}
        dotted={isDotted}
      />

      <div className="min-w-0 flex-1">
        <Input
          value={status.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          placeholder={translate('workflows.editor.statusNamePlaceholder')}
          size="sm"
        />
      </div>

      <div className="w-[120px] shrink-0">
        <ColorSelect
          value={status.color as StatusColor}
          onChange={(value) => onColorChange(index, value)}
          translate={translate}
        />
      </div>

      <div className="w-[110px] shrink-0">
        <Select
          value={group}
          onChange={(value) =>
            onGroupChange(status.id, value as StatusGroupType)
          }
          options={groupOptions}
        />
      </div>

      <Tooltip content={translate('workflows.editor.setAsInitial')}>
        <button
          type="button"
          onClick={() => onSetInitial(status.id)}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors',
            isInitial
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Icon name={isInitial ? 'check' : 'backlog'} className="h-4 w-4" />
        </button>
      </Tooltip>

      <Tooltip
        content={
          totalStatuses <= 2
            ? translate('workflows.editor.minStatusesTooltip')
            : translate('workflows.editor.deleteStatus')
        }
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          disabled={totalStatuses <= 2}
          className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0 p-0"
        >
          <Icon name="trash" className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  );
}
