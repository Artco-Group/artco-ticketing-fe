import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { EmptyState, Button } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

export default function NotFoundPage() {
  const { translate } = useAppTranslation('common');

  return (
    <EmptyState
      variant="error"
      title={translate('errors.notFound.title')}
      message={translate('errors.notFound.message')}
      action={
        <Link to={PAGE_ROUTES.DASHBOARD.ROOT}>
          <Button>{translate('errors.notFound.goToDashboard')}</Button>
        </Link>
      }
    />
  );
}
