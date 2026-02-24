import { useChangePasswordForm } from '../hooks/useChangePasswordForm';
import { Icon } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  PasswordInput,
  Button,
} from '@/shared/components/ui';

export function ChangePasswordForm() {
  const { translate } = useAppTranslation('auth');
  const { form, onSubmit, isPending, success } = useChangePasswordForm();

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Icon name="check-circle" size="xl" className="text-green-600" />
        </div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          {translate('changePassword.successTitle')}
        </h2>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
          {translate('changePassword.successMessage')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          {translate('changePassword.title')}
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          {translate('changePassword.subtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label={translate('changePassword.currentPassword')}
                    autoComplete="current-password"
                    placeholder={translate(
                      'changePassword.currentPasswordPlaceholder'
                    )}
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
                    label={translate('changePassword.newPassword')}
                    autoComplete="new-password"
                    placeholder={translate(
                      'changePassword.newPasswordPlaceholder'
                    )}
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
                    label={translate('changePassword.confirmPassword')}
                    autoComplete="new-password"
                    placeholder={translate(
                      'changePassword.confirmPasswordPlaceholder'
                    )}
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
            {isPending
              ? translate('changePassword.submitting')
              : translate('changePassword.submit')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
