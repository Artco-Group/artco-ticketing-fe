import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { Button } from '@/shared/components/ui';
import { useCheckEmail } from '../hooks';
import { useAppTranslation } from '@/shared/hooks';

export function CheckEmailContent() {
  const { translate } = useAppTranslation('auth');
  const { email, isResending, cooldown, canResend, handleResend } =
    useCheckEmail();

  const getButtonText = () => {
    if (isResending) return translate('checkEmail.resending');
    if (cooldown > 0)
      return translate('checkEmail.resendCooldown', {
        seconds: cooldown.toString(),
      });
    return translate('checkEmail.resend');
  };

  return (
    <div className="text-center">
      <h2 className="text-foreground max-smx:text-2xl mb-2 text-3xl font-bold tracking-tight">
        {translate('checkEmail.title')}
      </h2>

      <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
        {translate('checkEmail.messagePart1')}
        {email ? (
          <strong>{email}</strong>
        ) : (
          translate('checkEmail.messagePart2')
        )}
        . {translate('checkEmail.messagePart3')}
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
          <Link to={PAGE_ROUTES.AUTH.LOGIN}>
            {translate('checkEmail.backToLogin')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
