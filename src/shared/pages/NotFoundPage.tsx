import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to={PAGE_ROUTES.DASHBOARD.ROOT}
          className="bg-primary-500 hover:bg-primary-600 mt-6 inline-block rounded-lg px-6 py-3 text-white transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
