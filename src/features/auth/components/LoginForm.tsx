import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { useLoginForm } from '../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  PasswordInput,
  Button,
  Checkbox,
  Icon,
} from '@/shared/components/ui';

export function LoginForm() {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-2 text-3xl font-bold tracking-tight">
          Sign In
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          Welcome back. Please enter your credentials.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    label="Email"
                    placeholder="your.name@company.com"
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
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    label="Password"
                    placeholder="Enter your password"
                    leftIcon={<Icon name="lock" size="md" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="max-smx:flex-col max-smx:items-start max-smx:gap-3 flex-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        label="Remember me"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Link
              to={PAGE_ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
            loading={isPending}
          >
            Login
          </Button>
        </form>
      </Form>

      <div className="mt-7 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <a
            href="https://www.artcogroup.ba/page/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
