import { formatDateLocalized } from '@artco-group/artco-ticketing-sync';
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  type Ticket,
} from '@/types';
import {
  categoryBadgeConfig,
  getPriorityIcon,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
} from '@/shared/utils/ticket-helpers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
} from '@/shared/components/ui';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <Card
      onClick={() => onClick(ticket)}
      className="hover:shadow-button-hover cursor-pointer transition-all duration-200 hover:-translate-y-1"
    >
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg">{ticket.title}</CardTitle>
        <p className="text-muted-sm">{ticket.clientEmail}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status & Category */}
        <div className="flex flex-wrap gap-2">
          <Badge icon={getStatusIcon(ticket.status as TicketStatus)}>
            {getStatusLabel(ticket.status as TicketStatus)}
          </Badge>
          <Badge>
            {categoryBadgeConfig[ticket.category as TicketCategory].label}
          </Badge>
        </div>

        <Separator />

        {/* Priority & Date */}
        <div className="flex-between">
          <Badge icon={getPriorityIcon(ticket.priority as TicketPriority)}>
            {getPriorityLabel(ticket.priority as TicketPriority)}
          </Badge>
          <span className="text-muted-xs">
            {ticket.createdAt ? formatDateLocalized(ticket.createdAt) : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketCard;
