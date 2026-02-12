import { type Ticket } from '@/types';
import { Button, Icon } from '@/shared/components/ui';

interface TicketHeaderProps {
  ticket: Ticket;
  canEdit: boolean;
  onEdit?: () => void;
}

function TicketHeader({ ticket, canEdit, onEdit }: TicketHeaderProps) {
  return (
    <div className="border-b p-6">
      <span className="text-muted-foreground text-sm">
        #{ticket.ticketId || ticket.id}
      </span>

      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{ticket.title}</h1>
        {canEdit && onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Icon name="edit" size="sm" className="mr-2" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

export default TicketHeader;
