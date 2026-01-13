import DashboardHeader from './DashboardHeader';
import { CommentThread } from '@artco/component-library';
import {
  statusColors,
  priorityConfig,
  categoryColors,
  formatDateTime,
} from '../../utils/ticketHelpers';
import { fileAPI } from '../../services/fileApi';
import { formatTime } from '../../hooks/useScreenRecorder';

function TicketDetail({
  ticket,
  comments = [],
  userEmail,
  onLogout,
  onBack,
  newComment,
  onCommentChange,
  onAddComment,
  currentUser,
}) {
  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userEmail={userEmail}
        onLogout={onLogout}
        maxWidth="max-w-5xl"
        leftContent={
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Nazad na Moje Tikete
          </button>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Ticket Info Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8">
          {/* Title & Status */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            <span
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${statusColors[ticket.status]}`}
            >
              {ticket.status}
            </span>
          </div>

          {/* Ticket ID */}
          <p className="mb-6 text-sm text-gray-400">#{ticket.id}</p>

          {/* Meta Info Grid */}
          <div className="mb-8 grid grid-cols-2 gap-6 border-b border-gray-100 pb-8 md:grid-cols-4">
            <MetaItem
              label="Kreirano"
              value={formatDateTime(ticket.createdAt)}
            />
            <MetaItem
              label="Kategorija"
              value={
                <span
                  className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${categoryColors[ticket.category]}`}
                >
                  {ticket.category}
                </span>
              }
            />
            <MetaItem
              label="Prioritet"
              value={
                <span
                  className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
                >
                  {priorityConfig[ticket.priority].label}
                </span>
              }
            />
            <MetaItem
              label="Pogođeni modul"
              value={ticket.affectedModule || '-'}
            />
          </div>

          {/* Description Sections */}
          <DescriptionSection title="Opis" content={ticket.description} />
          <DescriptionSection
            title="Koraci za reprodukciju"
            content={ticket.reproductionSteps}
          />
          <DescriptionSection
            title="Očekivani rezultat"
            content={ticket.expectedResult}
          />
          <DescriptionSection
            title="Stvarni rezultat"
            content={ticket.actualResult}
          />

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Prilozi ({ticket.attachments.length})
              </h3>
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
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Snimak Ekrana
              </h3>
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

        {/* Comments Section */}
        <CommentThread
          comments={comments}
          newComment={newComment}
          onCommentChange={onCommentChange}
          onSubmit={onAddComment}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <span className="text-xs tracking-wide text-gray-400 uppercase">
        {label}
      </span>
      <p className="mt-1 text-sm text-gray-900">
        {typeof value === 'string' ? value : value}
      </p>
    </div>
  );
}

function DescriptionSection({ title, content }) {
  if (!content) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
        {content}
      </p>
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
        Preuzmi
      </button>
    </div>
  );
}

export default TicketDetail;
