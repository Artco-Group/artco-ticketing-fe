import type { User } from '@/types';
import {
  TicketStatus,
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
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
  getCategoryIcon,
  getCategoryLabel,
  type AssignedToValue,
} from '@/shared/utils/ticket-helpers';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  CATEGORY_OPTIONS,
} from '../utils/ticket-options';

const statusOptions: InlineEditOption<string>[] = STATUS_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
  icon: getStatusIcon(opt.value as TicketStatus),
}));

const priorityOptions: InlineEditOption<string>[] = PRIORITY_OPTIONS.map(
  (opt) => ({
    value: opt.value,
    label: opt.label,
    icon: getPriorityIcon(opt.value as TicketPriority),
  })
);

const categoryOptions: InlineEditOption<string>[] = CATEGORY_OPTIONS.map(
  (opt) => ({
    value: opt.value,
    label: opt.label,
    icon: getCategoryIcon(opt.value as TicketCategory),
  })
);

interface StatusEditProps {
  value: string;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (status: string) => void;
}

export function StatusEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: StatusEditProps) {
  return (
    <InlineEdit
      label="Status"
      value={value}
      options={statusOptions}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
      renderValue={(v) => (
        <Badge icon={getStatusIcon(v as TicketStatus)}>
          {getStatusLabel(v as TicketStatus)}
        </Badge>
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
  return (
    <InlineEdit
      label="Priority"
      value={value}
      options={priorityOptions}
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
  return (
    <InlineEdit
      label="Category"
      value={value}
      options={categoryOptions}
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
  const userMap = new Map(users.map((u) => [u.id, u]));

  const assigneeOptions: InlineEditOption<string>[] = developerUsers.map(
    (dev) => ({
      value: dev.id || '',
      label: dev.name || dev.email || '',
    })
  );

  const currentUser = value?.id ? userMap.get(value.id) : null;

  return (
    <InlineEdit
      label="Assignee"
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
          <span className="text-sm text-orange-600">Unassigned</span>
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
  return (
    <InlineDateEdit
      label="Start Date"
      value={value}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
    />
  );
}

export function DueDateEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: DateEditProps) {
  return (
    <InlineDateEdit
      label="Due Date"
      value={value}
      canEdit={canEdit}
      isLoading={isLoading}
      onChange={onChange}
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
  const userMap = new Map(users.map((u) => [u.id, u]));

  const engLeadOptions: InlineEditOption<string>[] = engLeadUsers.map(
    (lead) => ({
      value: lead.id || '',
      label: lead.name || lead.email || '',
    })
  );

  const currentUser = value?.id ? userMap.get(value.id) : null;

  return (
    <InlineEdit
      label="Eng Lead"
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
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const projectOptions: InlineEditOption<string>[] = projects.map(
    (project) => ({
      value: project.id,
      label: project.name,
    })
  );

  return (
    <InlineEdit
      label="Project"
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
