import type { Ticket } from '@/interfaces';
import {
  statusColors,
  priorityConfig,
  categoryColors,
  formatDate,
} from '../../utils/ticketHelpers';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <div
      onClick={() => onClick(ticket)}
      className="ticket-card cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Title */}
      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
        {ticket.title}
      </h3>

      {/* Client Email */}
      <p className="mb-4 text-sm text-gray-500">{ticket.clientEmail}</p>

      {/* Status & Category */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[ticket.status]}`}
        >
          {ticket.status}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${categoryColors[ticket.category]}`}
        >
          {ticket.category}
        </span>
      </div>

      {/* Priority & Date */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div
          className={`flex items-center gap-1.5 rounded px-2 py-1 ${priorityConfig[ticket.priority].bg}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={priorityConfig[ticket.priority].color}
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span
            className={`text-xs font-medium ${priorityConfig[ticket.priority].color}`}
          >
            {priorityConfig[ticket.priority].label}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(ticket.createdAt || '')}
        </span>
      </div>
    </div>
  );
}

export default TicketCard;
