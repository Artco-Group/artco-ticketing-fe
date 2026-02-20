import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppTranslation, type TranslateFn } from '@/shared/hooks';
import {
  useStatusConfigs,
  useDeleteStatusConfig,
  useProjectsUsingConfig,
} from '../api/status-configs-api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Spinner,
  EmptyState,
  Icon,
  Tooltip,
  ConfirmationDialog,
  useToast,
} from '@/shared/components/ui';
import { AvatarGroup } from '@/shared/components/ui/Avatar';
import { StatusIcon } from '@/shared/components/ui/BadgeIcons';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
import { getErrorMessage } from '@/shared';
import { cn } from '@/lib/utils';
import {
  getStatusesForGroup,
  type StatusGroupType,
} from '../utils/status-config-helpers';
import type {
  StatusConfig,
  StatusDefinition,
} from '@artco-group/artco-ticketing-sync';
import {
  STATUS_GROUP_TYPES,
  StatusGroupTranslationKeys,
  StatusColorToVariant,
} from '@artco-group/artco-ticketing-sync';

interface StatusGroupSectionProps {
  group: StatusGroupType;
  statuses: StatusDefinition[];
  initialStatusId?: string;
  translate: TranslateFn;
}

function StatusGroupSection({
  group,
  statuses,
  initialStatusId,
  translate,
}: StatusGroupSectionProps) {
  if (statuses.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
        {translate(StatusGroupTranslationKeys[group])}
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {statuses.map((status) => (
          <div key={status.id} className="flex items-center gap-1.5">
            <StatusIcon
              fillPercent={status.icon.fillPercent}
              variant={
                (StatusColorToVariant[status.color] || 'grey') as
                  | 'grey'
                  | 'blue'
                  | 'yellow'
                  | 'orange'
                  | 'purple'
                  | 'green'
                  | 'red'
                  | 'teal'
                  | 'pink'
              }
              dotted={status.icon.dotted}
            />
            <span className="text-sm">{status.name}</span>
            {status.id === initialStatusId && (
              <Badge
                variant="outline"
                size="sm"
                className="text-muted-foreground ml-0.5 text-[10px]"
              >
                {translate('workflows.initialStatus')}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProjectsInfoProps {
  configId: string;
  translate: TranslateFn;
}

function ProjectsInfo({ configId, translate }: ProjectsInfoProps) {
  const { data, isLoading } = useProjectsUsingConfig(configId);
  const projects = data?.projects || [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner className="h-3 w-3" />
        <span className="text-muted-foreground text-xs">Loading...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Badge variant="outline" size="sm" className="text-muted-foreground">
        {translate('workflows.noProjects')}
      </Badge>
    );
  }

  const avatars = projects.map((p) => ({
    fallback: p.name,
    tooltip: p.name,
  }));

  const tooltipContent = projects.map((p) => p.name).join(', ');

  return (
    <Tooltip content={tooltipContent}>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" size="sm" className="shrink-0">
          <Icon name="folder" className="mr-1 h-3 w-3" />
          {translate('workflows.projectCount', { count: projects.length })}
        </Badge>
        <AvatarGroup avatars={avatars} max={3} size="sm" />
      </div>
    </Tooltip>
  );
}

interface StatusConfigCardProps {
  config: StatusConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  translate: TranslateFn;
}

function StatusConfigCard({
  config,
  onEdit,
  onDelete,
  isDeleting,
  translate,
}: StatusConfigCardProps) {
  const statusesByGroup = STATUS_GROUP_TYPES.map((group) => ({
    group,
    statuses: getStatusesForGroup(config.statuses, config.groups[group]),
  }));

  return (
    <Card
      className={cn(
        'transition-shadow hover:shadow-md',
        config.isDefault && 'border-primary/30 bg-primary/5'
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{config.name}</CardTitle>
              {config.isDefault && (
                <Badge variant="default" size="sm">
                  {translate('workflows.default')}
                </Badge>
              )}
            </div>
            {config.description && (
              <CardDescription className="line-clamp-2">
                {config.description}
              </CardDescription>
            )}
          </div>
          {!config.isDefault && (
            <ProjectsInfo configId={config.id} translate={translate} />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {statusesByGroup.map(
          ({ group, statuses }) =>
            (group !== 'cancelled' || statuses.length > 0) && (
              <StatusGroupSection
                key={group}
                group={group}
                statuses={statuses}
                initialStatusId={config.groups.initial}
                translate={translate}
              />
            )
        )}
      </CardContent>

      {!config.isDefault && (
        <CardFooter className="border-t pt-4">
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(config.id)}
            >
              <Icon name="settings" className="mr-1.5 h-4 w-4" />
              {translate('workflows.edit')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(config.id)}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Icon name="trash" className="mr-1.5 h-4 w-4" />
              {translate('workflows.delete')}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export function StatusConfigsSettings() {
  const { translate } = useAppTranslation('settings');
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, error } = useStatusConfigs();
  const deleteMutation = useDeleteStatusConfig();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleCreate = () => navigate(PAGE_ROUTES.SETTINGS.WORKFLOWS_NEW);
  const handleEdit = (id: string) =>
    navigate(PAGE_ROUTES.SETTINGS.WORKFLOWS_EDIT.replace(':id', id));
  const handleDeleteClick = (id: string) => setDeleteTargetId(id);
  const handleCancelDelete = () => setDeleteTargetId(null);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title={translate('workflows.errorTitle')}
        message={translate('workflows.errorMessage')}
      />
    );
  }

  const configs = data?.statusConfigs || [];
  const sortedConfigs = [...configs].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            {translate('workflows.title')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {translate('workflows.description')}
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Icon name="plus" className="h-4 w-4" />
          {translate('workflows.createNew')}
        </Button>
      </div>

      {sortedConfigs.length === 0 ? (
        <EmptyState
          variant="no-data"
          title={translate('workflows.noConfigs')}
          message={translate('workflows.noConfigsMessage')}
        />
      ) : (
        <div className="space-y-4">
          {sortedConfigs.map((config) => (
            <StatusConfigCard
              key={config.id}
              config={config}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              isDeleting={deleteMutation.isPending}
              translate={translate}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={translate('workflows.deleteTitle')}
        description={translate('workflows.confirmDelete')}
        confirmLabel={translate('workflows.deleteConfirm')}
        cancelLabel={translate('workflows.deleteCancel')}
        variant="destructive"
        icon="trash"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default StatusConfigsSettings;
