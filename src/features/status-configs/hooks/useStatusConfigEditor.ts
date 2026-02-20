import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTranslation } from '@/shared/hooks';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DEFAULT_STATUS_CONFIG,
  type StatusDefinition,
  type StatusColor,
  createStatusConfigSchema,
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

interface GroupValidationState {
  hasBacklog: boolean;
  hasActive: boolean;
  hasCompleted: boolean;
  hasInitial: boolean;
}

const DEFAULT_FORM_VALUES: CreateStatusConfigInput = {
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

  const form = useForm<CreateStatusConfigInput>({
    resolver: zodResolver(createStatusConfigSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onSubmit',
  });

  const { append, remove, move } = useFieldArray({
    control: form.control,
    name: 'statuses',
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    new Set()
  );
  const [projectIdsInitialized, setProjectIdsInitialized] = useState(false);

  // Get all projects
  const allProjects = useMemo(
    () => projectsData?.projects || [],
    [projectsData]
  );

  // Watch groups for reactive validation state
  const watchedGroups = form.watch('groups');

  // Computed validation state for group requirements (real-time feedback)
  const groupValidation = useMemo<GroupValidationState>(
    () => ({
      hasBacklog: watchedGroups.backlog.length > 0,
      hasActive: watchedGroups.active.length > 0,
      hasCompleted: watchedGroups.completed.length > 0,
      hasInitial: !!watchedGroups.initial,
    }),
    [watchedGroups]
  );

  const initialAssignedProjectIds = useMemo(() => {
    if (!id) return new Set<string>();
    return new Set(
      allProjects.filter((p) => p.statusConfig?.id === id).map((p) => p.id)
    );
  }, [allProjects, id]);

  // Map react-hook-form errors to our error format for backwards compatibility
  const errors = useMemo(() => {
    const formErrors = form.formState.errors;
    const result: Record<string, string | undefined> = {};

    if (formErrors.name) {
      result.name = translate('workflows.editor.nameRequired');
    }
    if (formErrors.statuses?.message) {
      result.statuses = translate('workflows.editor.minStatuses');
    }
    if (formErrors.statuses?.root?.message) {
      result.statuses = formErrors.statuses.root.message;
    }
    // Check for individual status name errors
    if (Array.isArray(formErrors.statuses)) {
      const hasNameError = formErrors.statuses.some((s) => s?.name);
      if (hasNameError) {
        result.statusNames = translate('workflows.editor.statusNameRequired');
      }
    }
    if (formErrors.groups?.initial) {
      result.initial = translate('workflows.editor.initialRequired');
    }
    if (formErrors.groups?.backlog) {
      result.backlog = translate('workflows.editor.backlogRequired');
    }
    if (formErrors.groups?.active) {
      result.active = translate('workflows.editor.activeRequired');
    }
    if (formErrors.groups?.completed) {
      result.completed = translate('workflows.editor.completedRequired');
    }

    return result;
  }, [form.formState.errors, translate]);

  // Initialize selected projects when data loads
  useEffect(() => {
    if (
      isEditMode &&
      allProjects.length > 0 &&
      !projectIdsInitialized &&
      initialAssignedProjectIds.size > 0
    ) {
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
      form.reset({
        name: config.name,
        description: config.description || '',
        statuses: [...config.statuses],
        groups: { ...config.groups },
      });
      setIsInitialized(true);
    } else if (!isEditMode) {
      form.reset(DEFAULT_FORM_VALUES);
      setIsInitialized(true);
    }
  }, [isEditMode, existingConfig, isInitialized, form]);

  // Handlers
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const currentStatuses = form.getValues('statuses');
      const oldIndex = currentStatuses.findIndex((s) => s.id === active.id);
      const newIndex = currentStatuses.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
        const updatedStatuses = form.getValues('statuses');
        const reordered = updatedStatuses.map((s, i) => ({
          ...s,
          sortOrder: i,
        }));
        form.setValue('statuses', reordered);
      }
    },
    [move, form]
  );

  const handleStatusNameChange = useCallback(
    (index: number, newName: string) => {
      form.setValue(`statuses.${index}.name`, newName);
    },
    [form]
  );

  const handleStatusColorChange = useCallback(
    (index: number, color: StatusColor) => {
      form.setValue(`statuses.${index}.color`, color);
    },
    [form]
  );

  const handleStatusGroupChange = useCallback(
    (statusId: string, newGroup: StatusGroupType) => {
      const currentGroups = form.getValues('groups');
      const newGroups = {
        ...currentGroups,
        backlog: currentGroups.backlog.filter((gid) => gid !== statusId),
        active: currentGroups.active.filter((gid) => gid !== statusId),
        completed: currentGroups.completed.filter((gid) => gid !== statusId),
        cancelled: currentGroups.cancelled.filter((gid) => gid !== statusId),
      };
      newGroups[newGroup] = [...newGroups[newGroup], statusId];
      form.setValue('groups', newGroups);
    },
    [form]
  );

  const handleSetInitialStatus = useCallback(
    (statusId: string) => {
      form.setValue('groups.initial', statusId);
    },
    [form]
  );

  const handleAddStatus = useCallback(() => {
    const currentStatuses = form.getValues('statuses');
    const newStatus: StatusDefinition = {
      id: `status-${Date.now()}`,
      name: '',
      color: 'gray',
      sortOrder: currentStatuses.length,
      icon: { fillPercent: 0, dotted: false },
    };
    append(newStatus);

    // Add to backlog group by default
    const currentGroups = form.getValues('groups');
    form.setValue('groups', {
      ...currentGroups,
      backlog: [...currentGroups.backlog, newStatus.id],
    });
  }, [form, append]);

  const handleRemoveStatus = useCallback(
    (index: number) => {
      const currentStatuses = form.getValues('statuses');
      const statusId = currentStatuses[index].id;

      remove(index);

      // Remove from all groups
      const currentGroups = form.getValues('groups');
      form.setValue('groups', {
        ...currentGroups,
        initial:
          currentGroups.initial === statusId ? '' : currentGroups.initial,
        backlog: currentGroups.backlog.filter((gid) => gid !== statusId),
        active: currentGroups.active.filter((gid) => gid !== statusId),
        completed: currentGroups.completed.filter((gid) => gid !== statusId),
        cancelled: currentGroups.cancelled.filter((gid) => gid !== statusId),
      });
    },
    [form, remove]
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

  const handleSave = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();
    const currentGroups = formData.groups;

    const updatedStatuses: StatusDefinition[] = formData.statuses.map(
      (status, index) => {
        const group = getGroupForStatus(status.id, currentGroups);
        const groupStatuses = currentGroups[group];
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
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      statuses: updatedStatuses,
      groups: currentGroups,
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
    form,
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

    // Form (single source of truth)
    form,
    errors,

    // Validation state
    showValidation: form.formState.isSubmitted,
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
