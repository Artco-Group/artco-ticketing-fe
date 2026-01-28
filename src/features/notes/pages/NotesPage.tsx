import { EmptyState } from '@/shared/components/ui';

export default function NotesPage() {
  return (
    <EmptyState
      variant="no-data"
      title="Notes"
      message="No notes yet. Create your first note to get started."
    />
  );
}
