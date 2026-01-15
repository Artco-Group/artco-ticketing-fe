import type { ReactElement } from 'react';
import type { Ticket } from '@/types';

interface SummaryCardsProps {
  tickets: Ticket[];
}

function SummaryCards({ tickets }: SummaryCardsProps) {
  const totalOpen = tickets.filter(
    (t) => t.status !== 'Closed' && t.status !== 'Resolved'
  ).length;
  const unassigned = tickets.filter((t) => !t.assignedTo).length;
  const critical = tickets.filter((t) => t.priority === 'Critical').length;

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
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  const iconSvgs: Record<IconType, ReactElement> = {
    tickets: (
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    ),
    alert: (
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    ),
    warning: <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  };

  return (
    <div
      className={`summary-card rounded-xl border border-gray-200 bg-white p-6 ${highlighted ? 'ring-2 ring-orange-200' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[color]}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {iconSvgs[icon]}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
