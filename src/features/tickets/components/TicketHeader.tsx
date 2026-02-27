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
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-medium">
              #{ticket.ticketId || ticket.id}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold">{ticket.title}</h1>

          {ticket.description && (
            <div className="mt-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                {translate('details.description')}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          )}

          {ticket.affectedModule && (
            <div className="mt-4 flex items-center gap-1.5">
              <span className="text-muted-foreground text-xs">
                {translate('details.affectedModule')}:
              </span>
              <span className="bg-muted inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium">
                {ticket.affectedModule}
              </span>
            </div>
          )}
        </div>

        <div className="ml-4 flex shrink-0 flex-col items-end gap-3">
          {canEdit && onEdit && (
            <Button variant="outline" onClick={onEdit} className="shrink-0">
              <Icon name="edit" size="sm" className="mr-2" />
              Edit
            </Button>
          )}
          {ticket.resolution && (
            <div className="w-64 rounded-lg border border-green-200 bg-green-50/50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-green-700 uppercase">
                <Icon
                  name="check-circle"
                  size="xs"
                  className="text-green-600"
                />
                {translate('resolution.label')}
              </p>
              <p className="text-foreground mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.resolution}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketHeader;
