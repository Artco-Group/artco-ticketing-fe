import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { useLoginForm } from '../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
          Prijavite se
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          Dobrodošli nazad. Molimo unesite vaše podatke.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email adresa</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="vase.ime@kompanija.ba"
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
                <FormLabel>Lozinka</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Unesite vašu lozinku"
                    leftIcon={<Icon name="lock" size="md" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="max-smx:flex-col max-smx:items-start max-smx:gap-3 flex-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <label
                htmlFor="remember-me"
                className="text-muted-foreground cursor-pointer text-sm"
              >
                Zapamti me
              </label>
            </div>
            <Link
              to={PAGE_ROUTES.AUTH.FORGOT_PASSWORD}
              className="link text-sm"
            >
              Zaboravljena lozinka?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
            loading={isPending}
            rightIcon="arrow-right"
          >
            Prijavite se
          </Button>
        </form>
      </Form>

      <div className="mt-7 text-center">
        <p className="text-muted-sm">
          Nemate račun?{' '}
          <a
            href="https://www.artcogroup.ba/page/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Kontaktirajte administratora
          </a>
        </p>
      </div>
    </div>
  );
}
