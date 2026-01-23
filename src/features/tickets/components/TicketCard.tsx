import {
  type Ticket,
  formatDateLocalized,
} from '@artco-group/artco-ticketing-sync';
import {
  statusColors,
  priorityConfig,
  categoryColors,
} from '@/shared/utils/ticket-helpers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
} from '@/shared/components/ui';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <Card
      onClick={() => onClick(ticket)}
      className="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg">{ticket.title}</CardTitle>
        <p className="text-muted-foreground text-sm">{ticket.clientEmail}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status & Category */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={cn('rounded-full', statusColors[ticket.status])}
          >
            {ticket.status}
          </Badge>
          <Badge
            variant="outline"
            className={cn('rounded-full', categoryColors[ticket.category])}
          >
            {ticket.category}
          </Badge>
        </div>

        <Separator />

        {/* Priority & Date */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn(
              priorityConfig[ticket.priority].bg,
              priorityConfig[ticket.priority].color
            )}
          >
            {priorityConfig[ticket.priority].label}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {ticket.createdAt ? formatDateLocalized(ticket.createdAt) : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketCard;
