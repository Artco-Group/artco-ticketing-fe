import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { Button } from '@/shared/components/ui';
import { useCheckEmail } from '../hooks';

export function CheckEmailContent() {
  const { email, isResending, cooldown, canResend, handleResend } =
    useCheckEmail();

  const getButtonText = () => {
    if (isResending) return 'Sending...';
    if (cooldown > 0) return `Resend email (${cooldown}s)`;
    return 'Resend email';
  };

  return (
    <div className="text-center">
      <h2 className="text-foreground max-smx:text-2xl mb-2 text-3xl font-bold tracking-tight">
        Check your email
      </h2>

      <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
        We've sent a password reset link to{' '}
        {email ? <strong>{email}</strong> : 'your email address'}. Please check
        your inbox and follow the instructions.
      </p>

      <div className="space-y-3">
        <Button
          variant="default"
          className="w-full"
          size="lg"
          onClick={handleResend}
          loading={isResending}
          disabled={!canResend}
        >
          {getButtonText()}
        </Button>

        <Button
          variant="link"
          className="w-full pr-9"
          size="md"
          asChild
          leftIcon="chevron-left"
        >
          <Link to={PAGE_ROUTES.AUTH.LOGIN}>Back to login</Link>
        </Button>
      </div>
    </div>
  );
}
