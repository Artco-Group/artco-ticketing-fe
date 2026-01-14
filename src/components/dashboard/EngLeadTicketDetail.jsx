import { useState } from 'react';
import EngLeadSidebar from '../shared/EngLeadSidebar';
import CommentThread from '../shared/CommentThread';
import TicketDetails from '../shared/TicketDetails';
import { fileAPI } from '../../services/fileApi';

function EngLeadTicketDetail({
  ticket,
  comments = [],
  users,
  userEmail,
  onLogout,
  onBack,
  onNavigateToUsers,
  onAssignTicket,
  onStatusUpdate,
  onPriorityUpdate,
  newComment,
  onCommentChange,
  onAddComment,
  currentUser,
}) {
  const [selectedDeveloper, setSelectedDeveloper] = useState(
    ticket.assignedTo || ''
  );
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const developers = users.filter((user) => user.role === 'developer');

  const getAssignedTicketsCount = () => {
    // Ova funkcija treba da prima ID umjesto email
    return Math.floor(Math.random() * 10); // placeholder
  };

  const getAssigneeName = (assignedTo) => {
    const user = users.find((u) => u._id === assignedTo._id);
    return user ? user.name : assignedTo.name;
  };

  const handleAssign = () => {
    if (selectedDeveloper && selectedDeveloper !== ticket.assignedTo) {
      onAssignTicket(ticket._id, selectedDeveloper);
    }
  };

  const handleClose = async () => {
    if (ticket.status !== 'Resolved') return;

    setIsClosing(true);
    try {
      await onStatusUpdate(ticket.ticketId, 'Closed');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to close ticket:', error);
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EngLeadSidebar
        userEmail={userEmail}
        currentView="detail"
        onLogout={onLogout}
        onNavigateToTickets={onBack}
        onNavigateToUsers={onNavigateToUsers}
      />

      <div className="flex flex-1 flex-col">
        {/* Page Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <nav className="mb-1 text-sm text-gray-500">
                  <span
                    className="cursor-pointer hover:text-gray-700"
                    onClick={onBack}
                  >
                    All Tickets
                  </span>
                  <span className="mx-2">&gt;</span>
                  <span className="text-gray-900">{ticket.title}</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900">
                  {ticket.title}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Ticket Details */}
            <TicketDetails
              ticket={ticket}
              showClient={true}
              showAssignedTo={true}
              onDownloadAttachment={async (ticketId, index, filename) => {
                try {
                  await fileAPI.downloadAttachment(ticketId, index, filename);
                } catch {
                  alert('Failed to download file');
                }
              }}
              onDownloadScreenRecording={(ticketId, filename) => {
                fileAPI.downloadScreenRecording(ticketId, filename);
              }}
            />

            {/* Lead Controls */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Lead Controls
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Assignment Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assigned To
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={selectedDeveloper}
                      onChange={(e) => {
                        console.log('Selected value:', e.target.value);
                        setSelectedDeveloper(e.target.value);
                        console.log('Selected developer:', selectedDeveloper);
                      }}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                    >
                      <option value="">Select Developer</option>
                      {developers.map((dev) => (
                        <option key={dev._id} value={dev._id}>
                          {dev.name} ({getAssignedTicketsCount(dev._id)}{' '}
                          tickets)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={
                        !selectedDeveloper ||
                        selectedDeveloper === ticket.assignedTo
                      }
                      className="rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                  {ticket.assignedTo && (
                    <p className="mt-1 text-xs text-gray-500">
                      Currently assigned to:{' '}
                      {getAssigneeName(ticket.assignedTo)}
                    </p>
                  )}
                </div>

                {/* Priority Update Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Update Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      onPriorityUpdate(ticket._id, e.target.value)
                    }
                    disabled={
                      ticket.status !== 'Open' &&
                      ticket.status !== 'In Progress'
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  {ticket.status !== 'Open' &&
                    ticket.status !== 'In Progress' && (
                      <p className="mt-1 text-xs text-gray-500">
                        Priority can only be updated for Open or In Progress
                        tickets
                      </p>
                    )}
                </div>

                {/* Close Ticket Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Close Ticket
                  </label>
                  <button
                    onClick={handleClose}
                    disabled={ticket.status !== 'Resolved' || isClosing}
                    className="w-full rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isClosing ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Closing...
                      </div>
                    ) : (
                      'Close Ticket'
                    )}
                  </button>
                  {ticket.status !== 'Resolved' && (
                    <p className="mt-1 text-xs text-gray-500">
                      This button is only enabled when ticket status is
                      "Resolved"
                    </p>
                  )}
                  {showSuccess && (
                    <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-2">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-green-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-xs font-medium text-green-600">
                          Ticket closed successfully
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentThread
              comments={comments}
              newComment={newComment}
              onCommentChange={onCommentChange}
              onSubmit={onAddComment}
              currentUser={currentUser}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default EngLeadTicketDetail;
