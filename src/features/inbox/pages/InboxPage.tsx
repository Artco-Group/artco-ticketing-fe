import { EmptyState } from '@/shared/components/ui';

export default function InboxPage() {
  return (
    <EmptyState
      variant="no-notifications"
      title="Inbox"
      message="Your inbox is empty. New messages will appear here."
    />
  );
}
