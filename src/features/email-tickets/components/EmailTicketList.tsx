import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  type EmailTicket,
  EmailTicketStatus,
  formatDateDisplay,
  formatDateTime,
} from '@artco-group/artco-ticketing-sync';
import {
  EmptyState,
  Avatar,
  Icon,
  Button,
  ConfirmationDialog,
  Spinner,
} from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
import { type TicketId } from '@/types';
import {
  useEmailTickets,
  useDismissEmailTicket,
} from '../api/email-tickets-api';
import { EmailTicketDetailDialog } from './EmailTicketDetailDialog';
import { TicketDialog } from '@/features/tickets/components';

const EMAIL_TICKET_TABS_CONFIG = [
  {
    id: EmailTicketStatus.PENDING,
    labelKey: 'emailTickets.tabPending',
    icon: 'clock',
  },
  {
    id: EmailTicketStatus.CONVERTED,
    labelKey: 'emailTickets.tabConverted',
    icon: 'check',
  },
  {
    id: EmailTicketStatus.DISMISSED,
    labelKey: 'emailTickets.tabDismissed',
    icon: 'close',
  },
] as const;

export function EmailTicketList() {
  const { translate, language } = useAppTranslation('tickets');
  const toast = useToast();

  const [activeStatus, setActiveStatus] = useState<EmailTicketStatus>(
    EmailTicketStatus.PENDING
  );

  const { data, isLoading } = useEmailTickets(activeStatus);
  const dismissMutation = useDismissEmailTicket();

  const [selectedEmailTicket, setSelectedEmailTicket] =
    useState<EmailTicket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [dismissTarget, setDismissTarget] = useState<EmailTicket | null>(null);
  const [convertTarget, setConvertTarget] = useState<EmailTicket | null>(null);

  const emailTickets = data?.emailTickets ?? [];
  const isPendingTab = activeStatus === EmailTicketStatus.PENDING;
  const isConvertedTab = activeStatus === EmailTicketStatus.CONVERTED;
  const isDismissedTab = activeStatus === EmailTicketStatus.DISMISSED;

  const tabs = EMAIL_TICKET_TABS_CONFIG.map(({ labelKey, ...rest }) => ({
    ...rest,
    label: translate(labelKey),
  }));

  const handleViewDetail = (emailTicket: EmailTicket) => {
    setSelectedEmailTicket(emailTicket);
    setIsDetailOpen(true);
  };

  const handleDismissRequest = (emailTicket: EmailTicket) => {
    setDismissTarget(emailTicket);
  };

  const handleDismissConfirm = async () => {
    if (!dismissTarget) return;
    try {
      await dismissMutation.mutateAsync({ id: dismissTarget.id });
      toast.success(translate('emailTickets.dismissed'));
      setDismissTarget(null);
      setIsDetailOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleConvertRequest = (emailTicket: EmailTicket) => {
    setConvertTarget(emailTicket);
    setIsDetailOpen(false);
  };

  const handleConvertSuccess = async () => {
    // The convert flow is handled by TicketDialog's onSuccess + convert mutation
  };

  const getEmptyState = () => {
    if (isConvertedTab) {
      return (
        <EmptyState
          variant="no-tickets"
          title={translate('emailTickets.emptyConverted')}
          message={translate('emailTickets.emptyConvertedMessage')}
        />
      );
    }
    if (isDismissedTab) {
      return (
        <EmptyState
          variant="no-results"
          title={translate('emailTickets.emptyDismissed')}
          message={translate('emailTickets.emptyDismissedMessage')}
        />
      );
    }
    return (
      <EmptyState
        variant="no-notifications"
        title={translate('emailTickets.empty')}
        message={translate('emailTickets.emptyMessage')}
      />
    );
  };

  return (
    <>
      <div className="border-border-default flex items-center border-b px-4 py-2">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeStatus;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStatus(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 text-[13px] font-medium tracking-[-0.28px] transition-colors duration-150 focus:outline-none',
                  isActive
                    ? 'bg-greyscale-100 border-greyscale-300 text-greyscale-800 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]'
                    : 'bg-greyscale-100 border-greyscale-200 text-greyscale-700 hover:bg-greyscale-100 active:bg-greyscale-200 border-dashed'
                )}
              >
                <Icon name={tab.icon} size="sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : emailTickets.length === 0 ? (
        getEmptyState()
      ) : (
        <div className="divide-border divide-y">
          {emailTickets.map((emailTicket) => (
            <div
              key={emailTicket.id}
              className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors"
              onClick={() => handleViewDetail(emailTicket)}
            >
              <Avatar
                alt={emailTicket.senderName || emailTicket.senderEmail}
                src={emailTicket.matchedUser?.profilePic}
                size="sm"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {emailTicket.senderName || emailTicket.senderEmail}
                  </span>
                  {emailTicket.matchedUser && (
                    <Icon
                      name="check-simple"
                      size="xs"
                      className="text-primary"
                    />
                  )}
                </div>
                <div className="text-foreground truncate text-sm font-medium">
                  {emailTicket.subject}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  {emailTicket.body?.slice(0, 120) || '(No content)'}
                </div>
              </div>

              {/* Converted: show link to ticket */}
              {isConvertedTab && emailTicket.convertedTicketId && (
                <Link
                  to={PAGE_ROUTES.TICKETS.detail(
                    emailTicket.convertedTicketId as TicketId
                  )}
                  className="text-primary flex-shrink-0 text-xs font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {emailTicket.convertedTicketId}
                </Link>
              )}

              {/* Dismissed: show who dismissed */}
              {isDismissedTab && emailTicket.dismissedBy && (
                <div className="text-muted-foreground flex-shrink-0 text-right text-xs">
                  <div>{emailTicket.dismissedBy.name}</div>
                  {emailTicket.dismissedAt && (
                    <div>
                      {formatDateTime(emailTicket.dismissedAt, language)}
                    </div>
                  )}
                </div>
              )}

              <div className="text-muted-foreground flex-shrink-0 text-xs">
                {formatDateDisplay(emailTicket.receivedAt, language)}
              </div>

              {/* Action buttons only on pending tab */}
              {isPendingTab && (
                <div
                  className="flex flex-shrink-0 gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleConvertRequest(emailTicket)}
                  >
                    <Icon name="plus" size="sm" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDismissRequest(emailTicket)}
                  >
                    <Icon name="close" size="sm" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <EmailTicketDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        emailTicket={selectedEmailTicket}
        onConvert={handleConvertRequest}
        onDismiss={handleDismissRequest}
        isDismissing={dismissMutation.isPending}
      />

      {/* Dismiss Confirmation */}
      <ConfirmationDialog
        isOpen={!!dismissTarget}
        onClose={() => setDismissTarget(null)}
        onConfirm={handleDismissConfirm}
        title={translate('emailTickets.dismiss')}
        description={translate('emailTickets.dismissConfirm')}
        confirmLabel={translate('emailTickets.dismiss')}
        variant="destructive"
        isLoading={dismissMutation.isPending}
      />

      {/* Convert Flow - Opens TicketDialog pre-filled */}
      {convertTarget && (
        <TicketDialog
          isOpen={!!convertTarget}
          onClose={() => setConvertTarget(null)}
          defaultValues={{
            title: convertTarget.subject,
            description: convertTarget.body || '',
            clientEmail: convertTarget.senderEmail,
            emailTicketId: convertTarget.id,
          }}
          onSuccess={handleConvertSuccess}
        />
      )}
    </>
  );
}
