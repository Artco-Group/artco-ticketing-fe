import { EmptyState } from '@/shared/components/ui';

export default function ReportsPage() {
  return (
    <EmptyState
      variant="no-data"
      title="Reports"
      message="No reports available yet. Reports will appear here once data is available."
    />
  );
}
