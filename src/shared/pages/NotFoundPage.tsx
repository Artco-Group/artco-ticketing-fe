import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';
import { EmptyState, Button } from '@/shared/components/ui';

export default function NotFoundPage() {
  return (
    <EmptyState
      variant="error"
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist."
      action={
        <Link to={PAGE_ROUTES.DASHBOARD.ROOT}>
          <Button>Go to Dashboard</Button>
        </Link>
      }
    />
  );
}
