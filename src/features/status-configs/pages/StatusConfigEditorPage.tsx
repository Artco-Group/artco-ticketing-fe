import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button, Spinner } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Icon } from '@/shared/components/ui/Icon';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { SortableStatusItem } from '../components/SortableStatusItem';
import { ProjectPicker } from '../components/ProjectPicker';
import { useStatusConfigEditor } from '../hooks/useStatusConfigEditor';
import {
  getGroupForStatus,
  GROUP_REQUIREMENTS,
} from '../utils/status-config-helpers';

function ValidationIndicator({ valid }: { valid: boolean }) {
  return (
    <div
      className={cn(
        'h-2 w-2 rounded-full transition-colors',
        valid ? 'bg-green-500' : 'bg-muted'
      )}
    />
  );
}

export default function StatusConfigEditorPage() {
  const {
    isEditMode,
    isLoadingConfig,
    isLoading,
    name,
    setName,
    description,
    setDescription,
    statuses,
    groups,
    errors,
    showValidation,
    groupValidation,
    allProjects,
    selectedProjectIds,
    onDragEnd,
    onStatusNameChange,
    onStatusColorChange,
    onStatusGroupChange,
    onSetInitialStatus,
    onAddStatus,
    onRemoveStatus,
    onToggleProject,
    onSave,
    onCancel,
    translate,
  } = useStatusConfigEditor();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasErrors = Object.keys(errors).length > 0;
  const allRequirementsMet =
    groupValidation.hasBacklog &&
    groupValidation.hasActive &&
    groupValidation.hasCompleted &&
    groupValidation.hasInitial;

  if (isEditMode && isLoadingConfig) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-semibold">
            {isEditMode
              ? translate('workflows.editor.editTitle')
              : translate('workflows.editor.createTitle')}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {translate('workflows.editor.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            {translate('workflows.editor.cancel')}
          </Button>
          <Button size="sm" onClick={onSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-3.5 w-3.5" />
                {translate('workflows.editor.saving')}
              </>
            ) : (
              translate('workflows.editor.save')
            )}
          </Button>
        </div>
      </div>

      {/* Validation Errors - compact inline */}
      {hasErrors && showValidation && (
        <div className="text-destructive mb-5 flex items-center gap-2 text-sm">
          <Icon name="info" className="h-4 w-4 shrink-0" />
          <span>
            {[
              // Note: errors.name and errors.statusNames shown inline on their inputs
              errors.statuses,
              errors.initial,
              errors.backlog,
              errors.active,
              errors.completed,
            ]
              .filter(Boolean)
              .join(' • ')}
          </span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="w-[320px] shrink-0">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-foreground text-[13px] font-semibold tracking-tight">
              {translate('workflows.editor.basicInfo')}
            </h3>
            <div className="space-y-4">
              <Input
                label={translate('workflows.editor.name')}
                placeholder={translate('workflows.editor.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={showValidation ? errors.name : undefined}
                required
              />
              <Textarea
                label={translate('workflows.editor.descriptionLabel')}
                placeholder={translate(
                  'workflows.editor.descriptionPlaceholder'
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-border my-6 border-t" />

          {/* Assigned Projects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-[13px] font-semibold tracking-tight">
                {translate('workflows.editor.assignedProjects')}
              </h3>
              <Tooltip
                content={translate('workflows.editor.projectRestrictionNotice')}
              >
                <Icon
                  name="info"
                  className="text-muted-foreground h-3.5 w-3.5 cursor-help"
                />
              </Tooltip>
            </div>
            <ProjectPicker
              value={selectedProjectIds}
              options={allProjects}
              onChange={onToggleProject}
              placeholder={translate('workflows.editor.selectProjects')}
              disabledTooltip={translate('workflows.editor.projectHasTickets')}
            />
          </div>
        </div>

        {/* Right Column - Status Configuration */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-foreground text-[13px] font-semibold tracking-tight">
                {translate('workflows.editor.statuses')}
              </h3>
              {/* Compact requirement indicators */}
              <Tooltip
                content={
                  <div className="space-y-1 text-xs">
                    {GROUP_REQUIREMENTS.map(({ key, labelKey }) => (
                      <div key={key} className="flex items-center gap-2">
                        <ValidationIndicator valid={groupValidation[key]} />
                        <span>{translate(labelKey)}</span>
                      </div>
                    ))}
                  </div>
                }
              >
                <div className="flex cursor-help items-center gap-1">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      allRequirementsMet ? 'bg-green-500' : 'bg-amber-400'
                    )}
                  />
                  <span className="text-muted-foreground text-xs">
                    {
                      GROUP_REQUIREMENTS.filter(
                        ({ key }) => groupValidation[key]
                      ).length
                    }
                    /{GROUP_REQUIREMENTS.length}
                  </span>
                </div>
              </Tooltip>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddStatus}
              className="gap-1.5"
            >
              <Icon name="plus" className="h-3.5 w-3.5" />
              {translate('workflows.editor.addStatus')}
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={statuses.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {statuses.map((status, index) => {
                  const group = getGroupForStatus(status.id, groups);
                  const groupIndex = groups[group].indexOf(status.id);
                  return (
                    <SortableStatusItem
                      key={status.id}
                      status={status}
                      index={index}
                      group={group}
                      groupIndex={groupIndex}
                      isInitial={groups.initial === status.id}
                      totalStatuses={statuses.length}
                      onNameChange={onStatusNameChange}
                      onColorChange={onStatusColorChange}
                      onGroupChange={onStatusGroupChange}
                      onSetInitial={onSetInitialStatus}
                      onRemove={onRemoveStatus}
                      translate={translate}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
