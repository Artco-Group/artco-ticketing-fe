import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppTranslation } from '@/shared/hooks';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  DEFAULT_STATUS_CONFIG,
  type StatusDefinition,
  type StatusGroups,
  type StatusColor,
  type CreateStatusConfigInput,
} from '@artco-group/artco-ticketing-sync';
import {
  useStatusConfig,
  useCreateStatusConfig,
  useUpdateStatusConfig,
} from '../api/status-configs-api';
import {
  useProjects,
  useUpdateProject,
} from '@/features/projects/api/projects-api';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
import { asProjectId } from '@/types';
import {
  getGroupForStatus,
  getFillPercentForGroup,
  type StatusGroupType,
} from '../utils/status-config-helpers';

interface StatusConfigEditorErrors {
  name?: string;
  statuses?: string;
  statusNames?: string;
  initial?: string;
  backlog?: string;
  active?: string;
  completed?: string;
}

interface GroupValidationState {
  hasBacklog: boolean;
  hasActive: boolean;
  hasCompleted: boolean;
  hasInitial: boolean;
}

interface FormState {
  name: string;
  description: string;
  statuses: StatusDefinition[];
  groups: StatusGroups;
}

const DEFAULT_FORM_STATE: FormState = {
  name: '',
  description: '',
  statuses: DEFAULT_STATUS_CONFIG.statuses.map((s, i) => ({
    ...s,
    sortOrder: i,
  })),
  groups: { ...DEFAULT_STATUS_CONFIG.groups },
};

export function useStatusConfigEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { translate } = useAppTranslation('settings');
  const isEditMode = !!id;

  const { data: existingConfig, isLoading: isLoadingConfig } =
    useStatusConfig(id);
  const createMutation = useCreateStatusConfig();
  const updateMutation = useUpdateStatusConfig();
  const { data: projectsData } = useProjects();
  const updateProjectMutation = useUpdateProject();

  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    new Set()
  );
  const [showValidation, setShowValidation] = useState(false);
  const [projectIdsInitialized, setProjectIdsInitialized] = useState(false);

  const { name, description, statuses, groups } = formState;

  const setName = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, name: value }));
  }, []);

  const setDescription = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, description: value }));
  }, []);

  const setStatuses = useCallback(
    (
      updater:
        | StatusDefinition[]
        | ((prev: StatusDefinition[]) => StatusDefinition[])
    ) => {
      setFormState((prev) => ({
        ...prev,
        statuses:
          typeof updater === 'function' ? updater(prev.statuses) : updater,
      }));
    },
    []
  );

  const setGroups = useCallback(
    (updater: StatusGroups | ((prev: StatusGroups) => StatusGroups)) => {
      setFormState((prev) => ({
        ...prev,
        groups: typeof updater === 'function' ? updater(prev.groups) : updater,
      }));
    },
    []
  );

  // Get all projects and filter those currently using this status config
  const allProjects = useMemo(
    () => projectsData?.projects || [],
    [projectsData]
  );

  // Computed validation state for group requirements (real-time feedback)
  const groupValidation = useMemo<GroupValidationState>(
    () => ({
      hasBacklog: groups.backlog.length > 0,
      hasActive: groups.active.length > 0,
      hasCompleted: groups.completed.length > 0,
      hasInitial: !!groups.initial,
    }),
    [groups]
  );

  const initialAssignedProjectIds = useMemo(() => {
    if (!id) return new Set<string>();
    return new Set(
      allProjects.filter((p) => p.statusConfig?.id === id).map((p) => p.id)
    );
  }, [allProjects, id]);

  const errors = useMemo((): StatusConfigEditorErrors => {
    if (!showValidation) return {};

    const newErrors: StatusConfigEditorErrors = {};

    if (!name.trim()) {
      newErrors.name = translate('workflows.editor.nameRequired');
    }

    if (statuses.length < 2) {
      newErrors.statuses = translate('workflows.editor.minStatuses');
    }

    const emptyStatuses = statuses.filter((s) => !s.name.trim());
    if (emptyStatuses.length > 0) {
      newErrors.statusNames = translate('workflows.editor.statusNameRequired');
    }

    if (!groups.initial) {
      newErrors.initial = translate('workflows.editor.initialRequired');
    }

    if (groups.backlog.length === 0) {
      newErrors.backlog = translate('workflows.editor.backlogRequired');
    }

    if (groups.active.length === 0) {
      newErrors.active = translate('workflows.editor.activeRequired');
    }

    if (groups.completed.length === 0) {
      newErrors.completed = translate('workflows.editor.completedRequired');
    }

    return newErrors;
  }, [showValidation, name, statuses, groups, translate]);

  // Initialize selected projects when data loads
  useEffect(() => {
    if (
      isEditMode &&
      allProjects.length > 0 &&
      !projectIdsInitialized &&
      initialAssignedProjectIds.size > 0
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid initialization from async data
      setProjectIdsInitialized(true);
      setSelectedProjectIds(initialAssignedProjectIds);
    }
  }, [
    isEditMode,
    allProjects.length,
    initialAssignedProjectIds,
    projectIdsInitialized,
  ]);

  // Initialize form data from existing config or defaults
  useEffect(() => {
    if (isInitialized) return;

    if (isEditMode && existingConfig?.statusConfig) {
      const config = existingConfig.statusConfig;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid initialization from fetched data
      setFormState({
        name: config.name,
        description: config.description || '',
        statuses: [...config.statuses],
        groups: { ...config.groups },
      });
      setIsInitialized(true);
    } else if (!isEditMode) {
      setFormState(DEFAULT_FORM_STATE);
      setIsInitialized(true);
    }
  }, [isEditMode, existingConfig, isInitialized]);

  // Handlers
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setStatuses((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        return reordered.map((s, i) => ({ ...s, sortOrder: i }));
      });
    },
    [setStatuses]
  );

  const handleStatusNameChange = useCallback(
    (index: number, newName: string) => {
      setStatuses((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name: newName };
        return updated;
      });
    },
    [setStatuses]
  );

  const handleStatusColorChange = useCallback(
    (index: number, color: StatusColor) => {
      setStatuses((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], color };
        return updated;
      });
    },
    [setStatuses]
  );

  const handleStatusGroupChange = useCallback(
    (statusId: string, newGroup: StatusGroupType) => {
      setGroups((prev) => {
        const newGroups = {
          ...prev,
          backlog: prev.backlog.filter((gid) => gid !== statusId),
          active: prev.active.filter((gid) => gid !== statusId),
          completed: prev.completed.filter((gid) => gid !== statusId),
          cancelled: prev.cancelled.filter((gid) => gid !== statusId),
        };
        newGroups[newGroup] = [...newGroups[newGroup], statusId];
        return newGroups;
      });
    },
    [setGroups]
  );

  const handleSetInitialStatus = useCallback(
    (statusId: string) => {
      setGroups((prev) => ({ ...prev, initial: statusId }));
    },
    [setGroups]
  );

  const handleAddStatus = useCallback(() => {
    const newStatus: StatusDefinition = {
      id: `status-${Date.now()}`,
      name: '',
      color: 'gray',
      sortOrder: statuses.length,
      icon: { fillPercent: 0, dotted: false },
    };
    setStatuses((prev) => [...prev, newStatus]);
    setGroups((prev) => ({
      ...prev,
      backlog: [...prev.backlog, newStatus.id],
    }));
  }, [statuses.length, setStatuses, setGroups]);

  const handleRemoveStatus = useCallback(
    (index: number) => {
      const statusId = statuses[index].id;
      setStatuses((prev) => prev.filter((_, i) => i !== index));
      setGroups((prev) => ({
        ...prev,
        initial: prev.initial === statusId ? '' : prev.initial,
        backlog: prev.backlog.filter((gid) => gid !== statusId),
        active: prev.active.filter((gid) => gid !== statusId),
        completed: prev.completed.filter((gid) => gid !== statusId),
        cancelled: prev.cancelled.filter((gid) => gid !== statusId),
      }));
    },
    [statuses, setStatuses, setGroups]
  );

  const handleToggleProject = useCallback((projectId: string) => {
    setSelectedProjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  const validate = useCallback((): boolean => {
    setShowValidation(true);
    // Compute errors inline for immediate return value
    const hasNameError = !name.trim();
    const hasStatusCountError = statuses.length < 2;
    const hasEmptyStatusNames = statuses.some((s) => !s.name.trim());
    const hasInitialError = !groups.initial;
    const hasBacklogError = groups.backlog.length === 0;
    const hasActiveError = groups.active.length === 0;
    const hasCompletedError = groups.completed.length === 0;

    return !(
      hasNameError ||
      hasStatusCountError ||
      hasEmptyStatusNames ||
      hasInitialError ||
      hasBacklogError ||
      hasActiveError ||
      hasCompletedError
    );
  }, [name, statuses, groups]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    const updatedStatuses: StatusDefinition[] = statuses.map(
      (status, index) => {
        const group = getGroupForStatus(status.id, groups);
        const groupStatuses = groups[group];
        const indexInGroup = groupStatuses.indexOf(status.id);
        return {
          ...status,
          sortOrder: index,
          icon: {
            fillPercent: getFillPercentForGroup(group, indexInGroup),
            dotted: group === 'backlog',
          },
        };
      }
    );

    const data: CreateStatusConfigInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      statuses: updatedStatuses,
      groups,
    };

    try {
      let savedConfigId = id;

      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        const result = await createMutation.mutateAsync(data);
        savedConfigId = result.statusConfig?.id;
      }

      // Update project assignments if we have a config ID
      if (savedConfigId) {
        const projectsToAssign = allProjects.filter(
          (p) =>
            selectedProjectIds.has(p.id) && !initialAssignedProjectIds.has(p.id)
        );
        const projectsToUnassign = allProjects.filter(
          (p) =>
            !selectedProjectIds.has(p.id) && initialAssignedProjectIds.has(p.id)
        );

        await Promise.all([
          ...projectsToAssign.map((p) =>
            updateProjectMutation.mutateAsync({
              slug: asProjectId(p.slug),
              data: { statusConfigId: savedConfigId },
            })
          ),
          ...projectsToUnassign.map((p) =>
            updateProjectMutation.mutateAsync({
              slug: asProjectId(p.slug),
              data: { statusConfigId: null },
            })
          ),
        ]);
      }

      navigate(PAGE_ROUTES.SETTINGS.WORKFLOWS);
    } catch {
      // Error handled by mutation
    }
  }, [
    name,
    description,
    statuses,
    groups,
    validate,
    isEditMode,
    id,
    createMutation,
    updateMutation,
    navigate,
    allProjects,
    selectedProjectIds,
    initialAssignedProjectIds,
    updateProjectMutation,
  ]);

  const handleCancel = useCallback(() => {
    navigate(PAGE_ROUTES.SETTINGS.WORKFLOWS);
  }, [navigate]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return {
    // Mode
    isEditMode,
    isLoadingConfig,
    isLoading,

    // Form values
    name,
    setName,
    description,
    setDescription,
    statuses,
    groups,
    errors,

    // Validation state
    showValidation,
    groupValidation,

    // Projects
    allProjects,
    selectedProjectIds,

    // Status handlers
    onDragEnd: handleDragEnd,
    onStatusNameChange: handleStatusNameChange,
    onStatusColorChange: handleStatusColorChange,
    onStatusGroupChange: handleStatusGroupChange,
    onSetInitialStatus: handleSetInitialStatus,
    onAddStatus: handleAddStatus,
    onRemoveStatus: handleRemoveStatus,

    // Project handlers
    onToggleProject: handleToggleProject,

    // Form actions
    onSave: handleSave,
    onCancel: handleCancel,

    // Translation
    translate,
  };
}
