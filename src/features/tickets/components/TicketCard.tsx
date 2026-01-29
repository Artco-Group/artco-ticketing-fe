import { formatDateLocalized } from '@artco-group/artco-ticketing-sync';
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  type Ticket,
} from '@/types';
import {
  statusBadgeConfig,
  priorityBadgeConfig,
  categoryBadgeConfig,
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
          <Badge
            variant={statusBadgeConfig[ticket.status as TicketStatus].variant}
            icon={statusBadgeConfig[ticket.status as TicketStatus].getIcon?.()}
          >
            {statusBadgeConfig[ticket.status as TicketStatus].label}
          </Badge>
          <Badge
            variant={
              categoryBadgeConfig[ticket.category as TicketCategory].variant
            }
          >
            {categoryBadgeConfig[ticket.category as TicketCategory].label}
          </Badge>
        </div>

        <Separator />

        {/* Priority & Date */}
        <div className="flex-between">
          <Badge
            variant={
              priorityBadgeConfig[ticket.priority as TicketPriority].variant
            }
            icon={priorityBadgeConfig[
              ticket.priority as TicketPriority
            ].getIcon?.()}
          >
            {priorityBadgeConfig[ticket.priority as TicketPriority].label}
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
