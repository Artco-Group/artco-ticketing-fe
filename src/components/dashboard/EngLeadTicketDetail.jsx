import { useState } from 'react';
import EngLeadSidebar from './EngLeadSidebar';
import CommentThread from './CommentThread';
import { statusColors, priorityConfig } from '../../utils/ticketHelpers';
import { fileAPI } from '../../services/fileApi';
import { formatTime } from '../../hooks/useScreenRecorder';

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

  const getAssignedTicketsCount = (developerId) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            {/* Ticket Details Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Ticket Information
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Ticket ID
                      </dt>
                      <dd className="text-sm text-gray-900">{ticket.ticketId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Client
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {ticket.clientEmail}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Category
                      </dt>
                      <dd>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {ticket.category}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Priority
                      </dt>
                      <dd>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
                        >
                          {priorityConfig[ticket.priority].label}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Status & Assignment
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[ticket.status]}`}
                        >
                          {ticket.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Assigned To
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {ticket.assignedTo ? (
                          getAssigneeName(ticket.assignedTo)
                        ) : (
                          <span className="font-medium text-orange-600">
                            Unassigned
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Created
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(ticket.createdAt)}
                      </dd>
                    </div>
                    {ticket.lastUpdated && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Last Updated
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(ticket.lastUpdated)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="whitespace-pre-wrap text-gray-700">
                  {ticket.description}
                </p>
              </div>

              {ticket.affectedModule && (
                <div className="mt-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">
                    Affected Module
                  </h4>
                  <p className="text-sm text-gray-900">
                    {ticket.affectedModule}
                  </p>
                </div>
              )}

              {ticket.reproductionSteps && (
                <div className="mt-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">
                    Reproduction Steps
                  </h4>
                  <p className="text-sm whitespace-pre-wrap text-gray-900">
                    {ticket.reproductionSteps}
                  </p>
                </div>
              )}

              {ticket.expectedResult && (
                <div className="mt-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">
                    Expected Result
                  </h4>
                  <p className="text-sm text-gray-900">
                    {ticket.expectedResult}
                  </p>
                </div>
              )}

              {ticket.actualResult && (
                <div className="mt-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">
                    Actual Result
                  </h4>
                  <p className="text-sm text-gray-900">{ticket.actualResult}</p>
                </div>
              )}

              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">
                    Attachments ({ticket.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment, index) => (
                      <AttachmentItem
                        key={index}
                        attachment={attachment}
                        ticketId={ticket._id}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Screen Recording */}
              {ticket.screenRecording && ticket.screenRecording.originalName && (
                <div className="mt-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">
                    Snimak Ekrana
                  </h4>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          📹 {ticket.screenRecording.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(ticket.screenRecording.size / (1024 * 1024)).toFixed(2)} MB
                          {ticket.screenRecording.duration && (
                            <> • {formatTime(ticket.screenRecording.duration)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        fileAPI.downloadScreenRecording(
                          ticket._id,
                          ticket.screenRecording.originalName
                        );
                      }}
                      className="w-full rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white hover:bg-[#003366] transition-colors"
                    >
                      ⬇️ Preuzmi Video
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                    onChange={(e) => onPriorityUpdate(ticket._id, e.target.value)}
                    disabled={ticket.status !== 'Open' && ticket.status !== 'In Progress'}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  {(ticket.status !== 'Open' && ticket.status !== 'In Progress') && (
                    <p className="mt-1 text-xs text-gray-500">
                      Priority can only be updated for Open or In Progress tickets
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
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                      This button is only enabled when ticket status is "Resolved"
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

function AttachmentItem({ attachment, ticketId, index }) {
  const handleDownload = async () => {
    try {
      await fileAPI.downloadAttachment(
        ticketId,
        index,
        attachment.filename || attachment.originalName
      );
    } catch (error) {
      alert('Failed to download file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    } else if (mimetype === 'application/pdf') {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    } else {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-[#004179]">
          {getFileIcon(attachment.mimetype)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {attachment.filename || attachment.originalName}
          </p>
          {attachment.size && (
            <p className="text-xs text-gray-500">
              {formatFileSize(attachment.size)}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </button>
    </div>
  );
}

export default EngLeadTicketDetail;
