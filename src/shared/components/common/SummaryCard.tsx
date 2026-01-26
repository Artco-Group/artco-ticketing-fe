import type { Ticket } from '@artco-group/artco-ticketing-sync';
import { cn } from '@/lib/utils';
import { Card, CardContent, Icon } from '../ui';
import { useTicketSummary } from '../../hooks';

interface SummaryCardsProps {
  tickets: Ticket[];
}

function SummaryCards({ tickets }: SummaryCardsProps) {
  const { totalOpen, unassigned, critical } = useTicketSummary(tickets);

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <SummaryCard
        title="Total Open Tickets"
        value={totalOpen}
        icon="tickets"
        color="blue"
      />
      <SummaryCard
        title="Unassigned Tickets"
        value={unassigned}
        icon="alert"
        color="orange"
        highlighted={unassigned > 0}
      />
      <SummaryCard
        title="Critical Priority"
        value={critical}
        icon="warning"
        color="red"
      />
    </div>
  );
}

type IconType = 'tickets' | 'alert' | 'warning';
type ColorType = 'blue' | 'orange' | 'red';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: IconType;
  color: ColorType;
  highlighted?: boolean;
}

function SummaryCard({
  title,
  value,
  icon,
  color,
  highlighted = false,
}: SummaryCardProps) {
  const colorClasses: Record<ColorType, string> = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-error-100 text-error-500',
  };

  const iconMap: Record<IconType, 'all' | 'info' | 'priority'> = {
    tickets: 'all',
    alert: 'info',
    warning: 'priority',
  };

  return (
    <Card className={cn(highlighted && 'ring-2 ring-orange-200')}>
      <CardContent className="p-6">
        <div className="flex-between">
          <div>
            <p className="text-muted-sm font-medium">{title}</p>
            <p className="text-foreground mt-1 text-3xl font-bold">{value}</p>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              colorClasses[color]
            )}
          >
            <Icon name={iconMap[icon]} size="lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryCards;
