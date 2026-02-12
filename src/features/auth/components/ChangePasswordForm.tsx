import { useChangePasswordForm } from '../hooks/useChangePasswordForm';
import { Icon } from '@/shared/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  PasswordInput,
  Button,
} from '@/shared/components/ui';

export function ChangePasswordForm() {
  const { form, onSubmit, isPending, formError, success } =
    useChangePasswordForm();

  // Success state
  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Icon name="check-circle" size="xl" className="text-green-600" />
        </div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          Password Changed!
        </h2>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
          Your password has been updated successfully. Redirecting to
          dashboard...
        </p>
      </div>
    );
  }

  // Form state
  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          Change Your Password
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          For security, please set a new password for your account.
        </p>
      </div>

      {formError && (
        <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
          {formError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="Current password"
                    autoComplete="current-password"
                    placeholder="Enter current password"
                    leftIcon={<Icon name="lock" size="md" />}
                    disabled={isPending}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="New password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    leftIcon={<Icon name="lock" size="md" />}
                    disabled={isPending}
                    showStrengthMeter
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="Confirm new password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    leftIcon={<Icon name="lock" size="md" />}
                    disabled={isPending}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            loading={isPending}
          >
            {isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
