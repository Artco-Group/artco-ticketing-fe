import { Link } from 'react-router-dom';
import { PAGE_ROUTES } from '@/shared/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-greyscale-900 text-6xl font-bold">404</h1>
        <h2 className="text-greyscale-700 mt-4 text-2xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-greyscale-600 mt-2">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to={PAGE_ROUTES.DASHBOARD.ROOT}
          className="bg-brand-primary hover:bg-brand-primary-dark mt-6 inline-block rounded-lg px-6 py-3 text-white transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
