import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/components/ui';
import { useForgotPasswordForm } from '../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Button,
} from '@/shared/components/ui';

export function ForgotPasswordForm() {
  const { form, onSubmit, isPending, serverError } = useForgotPasswordForm();

  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          Forgot password
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {serverError && (
        <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
          {serverError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    label="Email address"
                    placeholder="your.name@company.com"
                    leftIcon={<Icon name="mail" size="md" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-1 w-full"
            size="lg"
            loading={isPending}
            rightIcon="arrow-right"
          >
            {isPending ? 'Sending...' : 'Send link'}
          </Button>
        </form>
      </Form>

      <div className="mt-5 text-center">
        <Link
          to={PAGE_ROUTES.AUTH.LOGIN}
          className="link inline-flex items-center gap-1 text-sm"
        >
          <Icon name="chevron-left" size="sm" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
