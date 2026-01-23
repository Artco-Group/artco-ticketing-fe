import { TicketForm } from '../components';
import { useTicketCreate } from '../hooks';

export default function TicketCreatePage() {
  const { onSubmit, onCancel, isPending } = useTicketCreate();

  return (
    <TicketForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isPending}
    />
  );
}
