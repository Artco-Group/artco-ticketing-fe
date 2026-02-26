import type { ReactNode } from 'react';
import type { User } from '@/types';
import {
  TicketPriority,
  TicketCategory,
} from '@artco-group/artco-ticketing-sync';
import { Badge, Avatar } from '@/shared/components/ui';
import { CompanyLogo } from '@/shared/components/composite';
import {
  InlineEdit,
  type InlineEditOption,
} from '@/shared/components/ui/InlineEdit';
import { InlineDateEdit } from '@/shared/components/ui/InlineDateEdit';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getDynamicStatusIcon,
  getCategoryIcon,
  type AssignedToValue,
} from '@/shared/utils/ticket-helpers';
import { useAppTranslation } from '@/shared/hooks';
import { useTranslatedOptions } from '../hooks';

interface WorkflowStatusOption {
  value: string;
  label: string;
  icon: ReactNode;
}

interface StatusEditProps {
  value: string;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (status: string) => void;
  workflowOptions?: WorkflowStatusOption[];
  getWorkflowStatusIcon?: (statusId: string) => ReactNode;
  getWorkflowStatusLabel?: (statusId: string) => string;
}

export function StatusEdit({
  value,
  canEdit,
  isLoading,
  onChange,
  workflowOptions,
  getWorkflowStatusIcon,
  getWorkflowStatusLabel,
}: StatusEditProps) {
  const { translate } = useAppTranslation('tickets');
  const {
    statusOptions: defaultStatusOptions,
    getStatusLabel: getDefaultLabel,
  } = useTranslatedOptions();

  const options: InlineEditOption<string>[] = workflowOptions
    ? workflowOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
      }))
    : defaultStatusOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
        icon: getDynamicStatusIcon(opt.value),
      }));

  const getCurrentIcon = (v: string): ReactNode => {
    if (getWorkflowStatusIcon) {
      return getWorkflowStatusIcon(v);
    }
    return getDynamicStatusIcon(v);
  };

  const getCurrentLabel = (v: string): string => {
    if (getWorkflowStatusLabel) {
      return getWorkflowStatusLabel(v);
    }
    return getDefaultLabel(v);
  };

  return (
    <InlineEdit
      label={translate('form.status')}
      value={value}
      options={options}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={(v) => (
        <Badge icon={getCurrentIcon(v)}>{getCurrentLabel(v)}</Badge>
      )}
    />
  );
}

interface PriorityEditProps {
  value: string;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (priority: string) => void;
}

export function PriorityEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: PriorityEditProps) {
  const { translate } = useAppTranslation('tickets');
  const { priorityOptions, getPriorityLabel } = useTranslatedOptions();

  const options: InlineEditOption<string>[] = priorityOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
    icon: getPriorityIcon(opt.value as TicketPriority),
  }));

  return (
    <InlineEdit
      label={translate('form.priority')}
      value={value}
      options={options}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={(v) => (
        <Badge icon={getPriorityIcon(v as TicketPriority)}>
          {getPriorityLabel(v as TicketPriority)}
        </Badge>
      )}
    />
  );
}

interface CategoryEditProps {
  value: string;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (category: string) => void;
}

export function CategoryEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: CategoryEditProps) {
  const { translate } = useAppTranslation('tickets');
  const { categoryOptions, getCategoryLabel } = useTranslatedOptions();

  const options: InlineEditOption<string>[] = categoryOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
    icon: getCategoryIcon(opt.value as TicketCategory),
  }));

  return (
    <InlineEdit
      label={translate('form.category')}
      value={value}
      options={options}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={(v) => (
        <Badge icon={getCategoryIcon(v as TicketCategory)}>
          {getCategoryLabel(v as TicketCategory) || v}
        </Badge>
      )}
    />
  );
}

interface AssigneeEditProps {
  value: AssignedToValue;
  users: User[];
  developerUsers: User[];
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (userId: string) => void;
}

export function AssigneeEdit({
  value,
  users,
  developerUsers,
  canEdit,
  isLoading,
  onChange,
}: AssigneeEditProps) {
  const { translate } = useAppTranslation('tickets');
  const userMap = new Map(users.map((u) => [u.id, u]));

  const assigneeOptions: InlineEditOption<string>[] = [
    // Add clear option if there's a current assignee
    ...(value?.id
      ? [{ value: '', label: translate('form.clearAssignee') }]
      : []),
    ...developerUsers.map((dev) => ({
      value: dev.id || '',
      label: dev.name || dev.email || '',
    })),
  ];

  const currentUser = value?.id ? userMap.get(value.id) : null;

  return (
    <InlineEdit
      label={translate('form.assignee')}
      value={value?.id || ''}
      options={assigneeOptions}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={() =>
        value ? (
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              src={currentUser?.profilePic}
              fallback={resolveAssigneeName(value, users)}
            />
            <span className="text-sm">{resolveAssigneeName(value, users)}</span>
          </div>
        ) : (
          <span className="text-sm text-orange-600">
            {translate('form.unassigned')}
          </span>
        )
      }
      renderOption={(option) => {
        const user = userMap.get(option.value);
        return (
          <>
            <Avatar size="sm" src={user?.profilePic} fallback={option.label} />
            <span>{option.label}</span>
          </>
        );
      }}
    />
  );
}

interface DateEditProps {
  value: string | Date | null | undefined;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (date: string | null) => void;
}

export function StartDateEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: DateEditProps) {
  const { translate, language } = useAppTranslation('tickets');

  return (
    <InlineDateEdit
      label={translate('form.startDate')}
      value={value}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      locale={language}
    />
  );
}

export function DueDateEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: DateEditProps) {
  const { translate, language } = useAppTranslation('tickets');

  return (
    <InlineDateEdit
      label={translate('form.dueDate')}
      value={value}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      locale={language}
    />
  );
}

export function TempSolutionDateEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: DateEditProps) {
  const { translate, language } = useAppTranslation('tickets');

  return (
    <InlineDateEdit
      label={translate('form.tempSolutionDate')}
      value={value}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      locale={language}
      labelClassName="w-36"
    />
  );
}

export function FinalSolutionDateEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: DateEditProps) {
  const { translate, language } = useAppTranslation('tickets');

  return (
    <InlineDateEdit
      label={translate('form.finalSolutionDate')}
      value={value}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      locale={language}
      labelClassName="w-36"
    />
  );
}

interface EngLeadEditProps {
  value: AssignedToValue;
  users: User[];
  engLeadUsers: User[];
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (userId: string) => void;
}

export function EngLeadEdit({
  value,
  users,
  engLeadUsers,
  canEdit,
  isLoading,
  onChange,
}: EngLeadEditProps) {
  const { translate } = useAppTranslation('tickets');
  const userMap = new Map(users.map((u) => [u.id, u]));

  const engLeadOptions: InlineEditOption<string>[] = [
    // Add clear option if there's a current eng lead
    ...(value?.id
      ? [{ value: '', label: translate('form.clearEngLead') }]
      : []),
    ...engLeadUsers.map((lead) => ({
      value: lead.id || '',
      label: lead.name || lead.email || '',
    })),
  ];

  const currentUser = value?.id ? userMap.get(value.id) : null;

  return (
    <InlineEdit
      label={translate('form.engLead')}
      value={value?.id || ''}
      options={engLeadOptions}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={() =>
        value ? (
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              src={currentUser?.profilePic}
              fallback={resolveAssigneeName(value, users)}
            />
            <span className="text-sm">{resolveAssigneeName(value, users)}</span>
          </div>
        ) : (
          <span className="text-sm">-</span>
        )
      }
      renderOption={(option) => {
        const user = userMap.get(option.value);
        return (
          <>
            <Avatar size="sm" src={user?.profilePic} fallback={option.label} />
            <span>{option.label}</span>
          </>
        );
      }}
    />
  );
}

export interface ProjectOption {
  id: string;
  name: string;
  clientProfilePic?: string;
}

interface ProjectEditProps {
  value: ProjectOption | null | undefined;
  projects: ProjectOption[];
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (projectId: string) => void;
}

export function ProjectEdit({
  value,
  projects,
  canEdit,
  isLoading,
  onChange,
}: ProjectEditProps) {
  const { translate } = useAppTranslation('tickets');
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const projectOptions: InlineEditOption<string>[] = projects.map(
    (project) => ({
      value: project.id,
      label: project.name,
    })
  );

  return (
    <InlineEdit
      label={translate('form.project')}
      value={value?.id || ''}
      options={projectOptions}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={() =>
        value ? (
          <div className="flex items-center gap-2">
            <CompanyLogo
              size="xs"
              src={value.clientProfilePic}
              alt={value.name}
              fallback={value.name}
            />
            <span className="text-sm">{value.name}</span>
          </div>
        ) : (
          <span className="text-sm">-</span>
        )
      }
      renderOption={(option) => {
        const project = projectMap.get(option.value);
        return (
          <>
            <CompanyLogo
              size="xs"
              src={project?.clientProfilePic}
              alt={option.label}
              fallback={option.label}
            />
            <span>{option.label}</span>
          </>
        );
      }}
    />
  );
}
