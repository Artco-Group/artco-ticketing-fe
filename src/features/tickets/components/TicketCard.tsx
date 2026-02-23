import {
  formatDateDisplay,
  TicketPriorityTranslationKeys,
  TicketCategoryTranslationKeys,
} from '@artco-group/artco-ticketing-sync';
import { TicketPriority, TicketCategory, type Ticket } from '@/types';
import {
  categoryBadgeConfig,
  getPriorityIcon,
  getDynamicStatusIcon,
} from '@/shared/utils/ticket-helpers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
} from '@/shared/components/ui';
import { useAppTranslation, useStatusLabel } from '@/shared/hooks';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

function TicketCard({ ticket, onClick }: TicketCardProps) {
  const { translate, language } = useAppTranslation('tickets');
  const { getStatusLabel } = useStatusLabel();

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
            icon={getDynamicStatusIcon(
              ticket.status,
              ticket.project?.statusConfig
            )}
          >
            {getStatusLabel(ticket.status, ticket.project?.statusConfig)}
          </Badge>
          <Badge
            icon={categoryBadgeConfig[
              ticket.category as TicketCategory
            ]?.getIcon?.()}
          >
            {translate(
              TicketCategoryTranslationKeys[ticket.category as TicketCategory]
            )}
          </Badge>
        </div>

        <Separator />

        {/* Priority & Date */}
        <div className="flex-between">
          <Badge icon={getPriorityIcon(ticket.priority as TicketPriority)}>
            {translate(
              TicketPriorityTranslationKeys[ticket.priority as TicketPriority]
            )}
          </Badge>
          <span className="text-muted-xs">
            {ticket.createdAt
              ? formatDateDisplay(ticket.createdAt, language)
              : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketCard;
