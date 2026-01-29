import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/components/ui';
import { useForgotPasswordForm } from '../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';

export function ForgotPasswordForm() {
  const { form, onSubmit, isPending, serverError, success } =
    useForgotPasswordForm();

  if (success) {
    return (
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Icon name="check-circle" size="lg" className="text-green-600" />
          </div>
          <CardTitle className="max-smx:text-2xl text-3xl">
            Email poslan!
          </CardTitle>
          <CardDescription className="text-base">
            Link za resetovanje lozinke je poslat na vaš email. Molimo
            provjerite vašu inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to={PAGE_ROUTES.AUTH.LOGIN} className="link text-sm">
            ← Nazad na prijavu
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          Zaboravljena lozinka
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          Unesite vaš email i poslat ćemo vam link za resetovanje lozinke.
        </p>
      </div>

      {serverError && (
        <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
          {serverError}
        </div>
      )}

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

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? 'Slanje...' : 'Pošalji link'}
            <Icon name="arrow-right" size="md" className="ml-2" />
          </Button>
        </form>
      </Form>

      <div className="mt-7 text-center">
        <Link
          to={PAGE_ROUTES.AUTH.LOGIN}
          className="text-primary text-sm font-medium hover:underline"
        >
          ← Nazad na prijavu
        </Link>
      </div>
    </div>
  );
}
