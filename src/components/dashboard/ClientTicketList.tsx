import type { Ticket } from '@/interfaces';
import DashboardHeader from '../shared/DashboardHeader';
import TicketCard from '../shared/TicketCard';

interface ClientTicketListProps {
  tickets: Ticket[];
  userEmail: string;
  onLogout: () => void;
  onCreateTicket: () => void;
  onViewTicket: (ticket: Ticket) => void;
}

function ClientTicketList({
  tickets,
  userEmail,
  onLogout,
  onCreateTicket,
  onViewTicket,
}: ClientTicketListProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Moji Tiketi"
        userEmail={userEmail}
        onLogout={onLogout}
        rightContent={
          <button
            onClick={onCreateTicket}
            className="flex items-center gap-2 rounded-lg bg-[#004179] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#003366]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Kreiraj novi tiket
          </button>
        }
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {tickets.length === 0 ? (
          <EmptyState onCreateTicket={onCreateTicket} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={onViewTicket}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface EmptyStateProps {
  onCreateTicket: () => void;
}

function EmptyState({ onCreateTicket }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.5"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Nemate kreiranih tiketa
      </h2>
      <p className="mb-6 text-gray-500">Kreirajte svoj prvi tiket za podršku</p>
      <button
        onClick={onCreateTicket}
        className="flex items-center gap-2 rounded-lg bg-[#004179] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#003366]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Kreiraj novi tiket
      </button>
    </div>
  );
}

export default ClientTicketList;
