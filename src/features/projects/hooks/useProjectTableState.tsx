import { useMemo, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { enUS, bs } from 'date-fns/locale';
import {
  type SortDirection,
  type BulkAction,
  useToast,
} from '@/shared/components/ui';
import { Icon } from '@/shared/components/ui';
import { useTranslatedToast, useAppTranslation } from '@/shared/hooks';
import { type GroupConfig } from '@/shared/hooks/useGroupedData';
import {
  useArchiveManyProjects,
  useArchiveProject,
  useDeleteManyProjects,
} from '../api/projects-api';
import type { ProjectTab } from '../utils/project-helpers';
import { asProjectId, type ProjectWithProgress, type User } from '@/types';

interface UseProjectTableStateOptions {
  activeTab?: ProjectTab;
  users?: User[];
}

export function useProjectTableState(
  options: UseProjectTableStateOptions = {}
) {
  const { activeTab = 'active' } = options;
  const { translate, language } = useAppTranslation('projects');
  const translatedToast = useTranslatedToast();
  const toast = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchiveAction, setIsArchiveAction] = useState(true);

  const { mutate: bulkDelete, isPending: isDeleting } = useDeleteManyProjects();
  const { mutate: archiveMany, isPending: isArchiving } =
    useArchiveManyProjects();
  const { mutate: archiveOne } = useArchiveProject();

  const clearSelection = () => setSelectedRows([]);

  const getItemLabel = (count: number) =>
    `${count} ${(count === 1 ? translate('singular') : translate('plural')).toLowerCase()}`;

  const getValidSlugs = () => {
    const slugs = selectedRows.filter((slug) => slug.length > 0);
    if (slugs.length === 0) {
      translatedToast.error('toast.error.noValidSelection', {
        items: translate('plural').toLowerCase(),
      });
      return null;
    }
    return slugs;
  };

  const handleBulkDelete = () => {
    const slugs = getValidSlugs();
    if (!slugs) return;

    bulkDelete(
      { slugs },
      {
        onSuccess: () => {
          clearSelection();
          setShowDeleteConfirm(false);
          translatedToast.success('toast.success.deleted', {
            item: getItemLabel(slugs.length),
          });
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to delete projects');
        },
      }
    );
  };

  const handleSort = (col: string | null, dir: SortDirection) => {
    setSortColumn(col);
    setSortDirection(dir);
  };

  const openArchiveConfirm = useCallback((archive: boolean) => {
    setIsArchiveAction(archive);
    setShowArchiveConfirm(true);
  }, []);

  const handleRowArchive = (project: ProjectWithProgress, archive: boolean) => {
    if (!project.slug) return;
    archiveOne(
      { slug: asProjectId(project.slug), isArchived: archive },
      {
        onSuccess: () => {
          translatedToast.success(
            archive ? 'toast.success.archived' : 'toast.success.unarchived',
            { item: translate('singular') }
          );
        },
      }
    );
  };

  const handleBulkArchive = () => {
    const slugs = getValidSlugs();
    if (!slugs) return;

    archiveMany(
      { slugs, isArchived: isArchiveAction },
      {
        onSuccess: () => {
          clearSelection();
          setShowArchiveConfirm(false);
          translatedToast.success(
            `toast.success.${isArchiveAction ? 'archived' : 'unarchived'}`,
            { item: getItemLabel(slugs.length) }
          );
        },
        onError: (error) => {
          toast.error(
            error?.message ||
              `Failed to ${isArchiveAction ? 'archive' : 'unarchive'} projects`
          );
        },
      }
    );
  };

  const bulkActions: BulkAction[] = useMemo(() => {
    const actions: BulkAction[] = [];

    if (activeTab === 'active' || activeTab === 'all') {
      actions.push({
        label: translate('table.rowActions.archive'),
        icon: <Icon name="inbox" size="sm" />,
        onClick: () => openArchiveConfirm(true),
      });
    }

    if (activeTab === 'archived' || activeTab === 'all') {
      actions.push({
        label: translate('table.rowActions.unarchive'),
        icon: <Icon name="upload" size="sm" />,
        onClick: () => openArchiveConfirm(false),
      });
    }

    actions.push({
      label: translate('table.rowActions.delete'),
      icon: <Icon name="trash" size="sm" />,
      onClick: () => setShowDeleteConfirm(true),
      variant: 'destructive' as const,
    });

    return actions;
  }, [activeTab, translate, openArchiveConfirm]);

  const groupConfigs: GroupConfig<ProjectWithProgress>[] = useMemo(
    () => [
      {
        key: 'dueDate',
        getGroupKey: (project) => {
          if (project.dueDate) {
            const date = new Date(project.dueDate);
            const locale = language === 'bs' ? bs : enUS;
            return format(date, 'LLLL yyyy', { locale });
          }
          return translate('groupBy.noDueDate');
        },
        getIcon: () => (
          <Icon name="clock" size="sm" className="text-greyscale-500" />
        ),
      },
      {
        key: 'client',
        getGroupKey: (project) => {
          const client = project.client as User | undefined;
          return client?.name || translate('groupBy.noClient');
        },
        getIcon: () => (
          <Icon name="user" size="sm" className="text-greyscale-500" />
        ),
      },
    ],
    [translate, language]
  );

  return {
    // Selection
    selectedRows,
    setSelectedRows,
    clearSelection,

    // Sorting
    sortColumn,
    sortDirection,
    handleSort,

    // Delete dialog
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleBulkDelete,
    isDeleting,

    // Archive dialog
    showArchiveConfirm,
    setShowArchiveConfirm,
    handleBulkArchive,
    handleRowArchive,
    isArchiving,
    isArchiveAction,

    // Actions
    bulkActions,

    // Grouping
    groupConfigs,
  };
}
