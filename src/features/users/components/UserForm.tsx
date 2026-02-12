import {
  type CreateUserFormData,
  type UpdateUserFormData,
  UserRoleDisplay,
  type Project,
} from '@artco-group/artco-ticketing-sync';
import { UserRole } from '@/types';
import {
  Form,
  FormField,
  FormItem,
  Input,
  Button,
  Select,
  Avatar,
} from '@/shared/components/ui';
import { ProjectPicker } from '@/shared/components/composite';
import { useUserForm, useProfilePicture } from '../hooks';

const AVAILABLE_ROLES: UserRole[] = [
  UserRole.DEVELOPER,
  UserRole.ENG_LEAD,
  UserRole.ADMIN,
];

interface UserFormProps {
  formId: string;
  onSubmit: (
    data: CreateUserFormData | UpdateUserFormData,
    projectIds?: string[],
    avatarFile?: File
  ) => void;
  defaultValues?: Partial<CreateUserFormData> & { projectIds?: string[] };
  isEditing?: boolean;
  isSubmitting?: boolean;
  projects?: Project[];
  currentUserProjectIds?: string[];
  userId?: string;
  currentAvatar?: string;
  isClient?: boolean;
}

function UserForm({
  formId,
  onSubmit,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
  projects = [],
  currentUserProjectIds = [],
  userId,
  currentAvatar,
  isClient = false,
}: UserFormProps) {
  const {
    fileInputRef,
    pendingFile,
    isLoading: isAvatarLoading,
    hasAvatar,
    getAvatarSrc,
    handleFileSelect,
    handleRemove: handleRemoveAvatar,
    openFilePicker,
  } = useProfilePicture({ userId, currentAvatar, isEditing });

  const {
    form,
    selectedProjectIds,
    setSelectedProjectIds,
    createSubmitHandler,
  } = useUserForm({
    defaultValues: isClient
      ? { ...defaultValues, role: UserRole.CLIENT }
      : defaultValues,
    isEditing,
    onSubmit,
    initialProjectIds: currentUserProjectIds,
    isClient,
  });

  const projectOptions = projects.map((p) => ({
    id: p.slug || p.id || '',
    name: p.name,
    clientName: p.client?.name,
  }));

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={createSubmitHandler(pendingFile)}
        className="space-y-5"
      >
        <div className="flex items-center gap-4">
          <Avatar
            src={getAvatarSrc()}
            fallback={form.watch('name') || 'U'}
            size="xl"
            className="h-16 w-16"
          />
          <div>
            <p className="text-sm font-medium">Profile Picture</p>
            <div className="mt-1 flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isAvatarLoading || isSubmitting}
                onClick={openFilePicker}
              >
                {isAvatarLoading ? 'Uploading...' : 'Upload Image'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasAvatar || isAvatarLoading || isSubmitting}
                onClick={handleRemoveAvatar}
              >
                Remove
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              We support PNGs, JPEGs and GIFs under 10MB
            </p>
          </div>
        </div>

        <div className="border-border my-4 border-t border-dashed" />

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label="Name"
                autoComplete="name"
                placeholder={
                  isClient ? 'Enter client name' : 'Enter member name'
                }
                error={fieldState.error?.message}
                required
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label="Email Address"
                autoComplete="email"
                placeholder="Enter email address"
                error={fieldState.error?.message}
                required
                {...field}
              />
            </FormItem>
          )}
        />

        {!isClient && (
          <FormField
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-0">
                <Select
                  label="Role"
                  options={AVAILABLE_ROLES.map((role) => ({
                    label: UserRoleDisplay[role],
                    value: role,
                  }))}
                  placeholder="Select a role"
                  error={fieldState.error?.message}
                  required
                  {...field}
                />
              </FormItem>
            )}
          />
        )}

        {!isClient &&
          projectOptions.length > 0 &&
          (form.watch('role') === UserRole.DEVELOPER ||
            form.watch('role') === UserRole.ENG_LEAD) && (
            <ProjectPicker
              label="Assign to project"
              value={selectedProjectIds}
              options={projectOptions}
              onChange={setSelectedProjectIds}
              placeholder="Select projects..."
              disabled={isSubmitting}
            />
          )}

        {!isEditing && (
          <p className="text-muted-foreground text-sm">
            A temporary password will be generated and sent to the{' '}
            {isClient ? 'client' : 'user'} via email. They will be required to
            change it on first login.
          </p>
        )}
      </form>
    </Form>
  );
}

export default UserForm;
