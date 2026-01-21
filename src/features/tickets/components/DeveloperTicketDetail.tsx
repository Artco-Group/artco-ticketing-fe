import type { FormEvent } from 'react';
import { useState } from 'react';
import type {
  Ticket,
  Comment,
  User,
} from '@artco-group/artco-ticketing-sync/types';
import { toast } from 'sonner';
import PageHeader from '@/shared/components/layout/PageHeader';
import CommentThread from './CommentThread';
import TicketDetails from './TicketDetails';
import { fileAPI } from '../api/file-api';

interface DeveloperTicketDetailProps {
  ticket: Ticket | null;
  comments?: Comment[];
  onLogout: () => void;
  onBack: () => void;
  onStatusUpdate: (ticketId: string, status: string) => Promise<void>;
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: (e: FormEvent<HTMLFormElement>) => void;
  currentUser: User | null;
}

function DeveloperTicketDetail({
  ticket,
  comments = [],
  onLogout,
  onBack,
  onStatusUpdate,
  newComment,
  onCommentChange,
  onAddComment,
  currentUser,
}: DeveloperTicketDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!ticket) return null;

  const handleResolve = async () => {
    if (ticket.status !== 'In Progress') return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(ticket.ticketId || ticket._id || '', 'Resolved');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to resolve ticket:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        userEmail={currentUser?.email || ''}
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
            Back to Assigned Tickets
          </button>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Ticket Details */}
        <TicketDetails
          ticket={ticket}
          showClient={true}
          showAssignedTo={false}
          onDownloadAttachment={async (ticketId, index, filename) => {
            try {
              await fileAPI.downloadAttachment(ticketId, index, filename);
            } catch {
              toast.error('Failed to download file');
            }
          }}
          onDownloadScreenRecording={(ticketId, filename) => {
            fileAPI.downloadScreenRecording(ticketId, filename);
          }}
          className="mb-6"
        />

        {/* Resolve Button Section */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Ticket Actions
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleResolve}
              disabled={ticket.status !== 'In Progress' || isUpdating}
              className="rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? (
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
                  Updating...
                </div>
              ) : (
                'Mark as Resolved'
              )}
            </button>

            {ticket.status !== 'In Progress' && (
              <p className="text-xs text-gray-500">
                This button is only enabled when ticket status is "In Progress"
              </p>
            )}
          </div>

          {showSuccess && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
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
                <span className="text-sm font-medium text-green-600">
                  Ticket marked as resolved successfully
                </span>
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

export default DeveloperTicketDetail;
