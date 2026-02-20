import { type Ticket } from '@/types';
import { Button, Icon } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

interface TicketHeaderProps {
  ticket: Ticket;
  canEdit: boolean;
  onEdit?: () => void;
}

function TicketHeader({ ticket, canEdit, onEdit }: TicketHeaderProps) {
  const { translate } = useAppTranslation('tickets');

  return (
    <div className="border-b p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-muted-foreground text-sm">
            #{ticket.ticketId || ticket.id}
          </span>
          <h1 className="mt-1 text-2xl font-bold">{ticket.title}</h1>

          {ticket.description && (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          )}

          {ticket.affectedModule && (
            <p className="text-muted-foreground mt-2 text-xs">
              <span className="font-medium">
                {translate('details.affectedModule')}:
              </span>{' '}
              {ticket.affectedModule}
            </p>
          )}
        </div>

        {canEdit && onEdit && (
          <Button variant="outline" onClick={onEdit} className="ml-4 shrink-0">
            <Icon name="edit" size="sm" className="mr-2" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

export default TicketHeader;
