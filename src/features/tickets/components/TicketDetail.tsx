import {
  asTicketId,
  type Ticket,
  type User,
  type Project,
  type TicketId,
  type UserId,
} from '@/types';
import { useRoleFlags } from '@/shared';
import TicketHeader from './TicketHeader';
import TicketMetadata from './TicketMetadata';
import TicketAdditionalDetails from './TicketAdditionalDetails';
import TicketDiscussion from './TicketDiscussion';
import { SubtaskSection } from './SubtaskSection';

interface TicketDetailProps {
  ticket: Ticket | null;
  currentUser: User | null;
  users?: User[];
  projects?: Project[];
  onBack: () => void;
  onStatusUpdate?: (ticketId: TicketId, status: string) => Promise<void>;
  onPriorityUpdate?: (ticketId: TicketId, priority: string) => void;
  onAssignTicket?: (ticketId: TicketId, developerId: UserId) => void;
  onEdit?: () => void;
}

function TicketDetail({
  ticket,
  currentUser,
  users = [],
  projects = [],
  onEdit,
}: TicketDetailProps) {
  const { isAdmin, isEngLead, isDeveloper, isClient } = useRoleFlags(
    currentUser?.role
  );

  if (!ticket) return null;

  const canUploadFiles = isAdmin || isClient;
  const canEditSubtasks = isEngLead || isAdmin;
  const canToggleSubtasks = isDeveloper || isEngLead || isAdmin;

  return (
    <div className="flex-1 overflow-auto">
      <TicketHeader
        ticket={ticket}
        canEdit={isEngLead || isAdmin}
        onEdit={onEdit}
      />

      <div className="border-b p-6">
        <TicketMetadata
          ticket={ticket}
          users={users}
          projects={projects}
          isClient={isClient}
          isEngLead={isEngLead}
          isAdmin={isAdmin}
        />
      </div>

      <TicketAdditionalDetails
        ticket={ticket}
        canUploadFiles={canUploadFiles}
      />

      <div className="border-b p-6">
        <SubtaskSection
          ticketId={asTicketId(ticket.ticketId || '')}
          canEdit={canEditSubtasks}
          canToggle={canToggleSubtasks}
        />
      </div>

      <TicketDiscussion
        ticketId={ticket.ticketId || ''}
        currentUserId={currentUser?.id || ''}
      />
    </div>
  );
}

export default TicketDetail;
