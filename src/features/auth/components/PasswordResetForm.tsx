import { Link } from 'react-router-dom';
import { usePasswordResetForm } from '../hooks';
import { PAGE_ROUTES } from '@/shared/constants';
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

export function PasswordResetForm() {
  const { translate } = useAppTranslation('auth');
  const {
    form,
    onSubmit,
    isPending,
    verifyingToken,
    tokenValid,
    tokenError,
    success,
    navigateToLogin,
  } = usePasswordResetForm();

  if (verifyingToken) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="border-primary/20 border-t-primary mx-auto h-12 w-12 animate-spin rounded-full border-4"></div>
        </div>
        <p className="text-muted-foreground text-base">
          {translate('resetPassword.verifyingToken')}
        </p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="text-center">
        <Icon name="info" size="xl" className="text-destructive mb-3" />
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          {translate('resetPassword.linkExpired')}
        </h2>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
          {tokenError || translate('resetPassword.invalidLink')}
        </p>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-sm">
          {translate('resetPassword.requestNewLink')}
        </p>
        <Button onClick={navigateToLogin} className="w-full" size="lg">
          {translate('resetPassword.backToLogin')}
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Icon name="check-circle" size="xl" className="text-green-600" />
        </div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          {translate('resetPassword.successTitle')}
        </h2>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
          {translate('resetPassword.successMessage')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          {translate('resetPassword.title')}
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          {translate('resetPassword.subtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label={translate('resetPassword.password')}
                    autoComplete="new-password"
                    placeholder={translate('resetPassword.passwordPlaceholder')}
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
                    label={translate('resetPassword.confirmPassword')}
                    autoComplete="new-password"
                    placeholder={translate(
                      'resetPassword.confirmPasswordPlaceholder'
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
              ? translate('resetPassword.submitting')
              : translate('resetPassword.submit')}
          </Button>
        </form>
      </Form>

      <div className="mt-5 text-center">
        <Button
          variant="link"
          className="h-auto p-0 pr-2"
          asChild
          leftIcon="chevron-left"
        >
          <Link to={PAGE_ROUTES.AUTH.LOGIN}>
            {translate('resetPassword.backToLogin')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
