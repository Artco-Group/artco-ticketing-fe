import {
  type CreateUserFormData,
  type UpdateUserFormData,
  UserRoleDisplay,
} from '@artco-group/artco-ticketing-sync';
import { UserRole } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  PasswordInput,
  Button,
  Select,
  Icon,
} from '@/shared/components/ui';
import { useUserForm } from '../hooks';

const AVAILABLE_ROLES: UserRole[] = [
  UserRole.CLIENT,
  UserRole.DEVELOPER,
  UserRole.ENG_LEAD,
  UserRole.ADMIN,
];

interface UserFormProps {
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<CreateUserFormData>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

function UserForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
}: UserFormProps) {
  const { form, onSubmit: handleSubmit } = useUserForm({
    defaultValues,
    isEditing,
    onSubmit,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Name"
                  autoComplete="name"
                  placeholder="Enter user name"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter email address"
                  leftIcon={<Icon name="mail" size="md" />}
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Select
                  label="Role"
                  options={AVAILABLE_ROLES.map((role) => ({
                    label: UserRoleDisplay[role],
                    value: role,
                  }))}
                  placeholder="Select a role"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!isEditing && (
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="Password"
                    autoComplete="new-password"
                    placeholder="Enter password"
                    leftIcon={<Icon name="lock" size="md" />}
                    showStrengthMeter
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Add User'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UserForm;
