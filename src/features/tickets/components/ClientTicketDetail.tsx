import type { FormEvent } from 'react';
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

interface ClientTicketDetailProps {
  ticket: Ticket | null;
  comments?: Comment[];
  userEmail: string;
  onLogout: () => void;
  onBack: () => void;
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: (e: FormEvent<HTMLFormElement>) => void;
  currentUser: User | null;
}

function ClientTicketDetail({
  ticket,
  comments = [],
  userEmail,
  onLogout,
  onBack,
  newComment,
  onCommentChange,
  onAddComment,
  currentUser,
}: ClientTicketDetailProps) {
  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
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
        {/* Ticket Details */}
        <TicketDetails
          ticket={ticket}
          showClient={false}
          showAssignedTo={false}
          onDownloadAttachment={async (ticketId, index, filename) => {
            try {
              await fileAPI.downloadAttachment(ticketId, index, filename);
            } catch {
              toast.error('Failed to download file');
            }
          }}
          onDownloadScreenRecording={async (ticketId, filename) => {
            try {
              await fileAPI.downloadScreenRecording(ticketId, filename);
            } catch {
              toast.error('Failed to download video');
            }
          }}
          formatDateTime={(date) => {
            if (!date) return '';
            const d = typeof date === 'string' ? new Date(date) : date;
            return d.toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          }}
          className="mb-6"
        />

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

export default ClientTicketDetail;
