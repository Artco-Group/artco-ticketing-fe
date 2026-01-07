import { statusColors, priorityConfig } from '../../utils/ticketHelpers';

function EngLeadTicketTable({ tickets, users, onViewTicket }) {
  const getAssigneeName = (assignedTo) => {
    const user = users.find((u) => u.email === assignedTo.email);
    return user ? user.name : assignedTo.email;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                onClick={() => onViewTicket(ticket)}
                className="ticket-row cursor-pointer transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {ticket.title}
                  </div>
                  <div className="text-sm text-gray-500">{ticket.id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {ticket.clientEmail}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {ticket.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
                  >
                    {priorityConfig[ticket.priority].label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {ticket.assignedTo ? (
                    getAssigneeName(ticket.assignedTo)
                  ) : (
                    <span className="font-medium text-orange-600">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(ticket.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tickets.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No tickets found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No tickets match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default EngLeadTicketTable;
