import { Link } from 'react-router-dom';
import {
  type EmailTicket,
  EmailTicketStatus,
  formatDateTime,
} from '@artco-group/artco-ticketing-sync';
import {
  SideDialog,
  Button,
  Avatar,
  Badge,
  Icon,
} from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
import { type TicketId } from '@/types';

interface EmailTicketDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emailTicket: EmailTicket | null;
  onConvert: (emailTicket: EmailTicket) => void;
  onDismiss: (emailTicket: EmailTicket) => void;
  isDismissing?: boolean;
}

const STATUS_BADGE_CONFIG: Record<
  EmailTicketStatus,
  { variant: 'default' | 'secondary' | 'outline'; labelKey: string }
> = {
  [EmailTicketStatus.PENDING]: {
    variant: 'default',
    labelKey: 'emailTickets.tabPending',
  },
  [EmailTicketStatus.CONVERTED]: {
    variant: 'secondary',
    labelKey: 'emailTickets.tabConverted',
  },
  [EmailTicketStatus.DISMISSED]: {
    variant: 'outline',
    labelKey: 'emailTickets.tabDismissed',
  },
};

export function EmailTicketDetailDialog({
  isOpen,
  onClose,
  emailTicket,
  onConvert,
  onDismiss,
  isDismissing,
}: EmailTicketDetailDialogProps) {
  const { translate, language } = useAppTranslation('tickets');

  if (!emailTicket) return null;

  const isPending = emailTicket.status === EmailTicketStatus.PENDING;
  const badgeConfig = STATUS_BADGE_CONFIG[emailTicket.status];

  return (
    <SideDialog
      isOpen={isOpen}
      onClose={onClose}
      title={emailTicket.subject}
      width="lg"
      footer={
        isPending ? (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onDismiss(emailTicket)}
              loading={isDismissing}
              leftIcon="close"
            >
              {translate('emailTickets.dismiss')}
            </Button>
            <Button onClick={() => onConvert(emailTicket)} leftIcon="plus">
              {translate('emailTickets.convert')}
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-5">
        {/* Sender */}
        <div className="flex items-center gap-3">
          <Avatar
            alt={emailTicket.senderName || emailTicket.senderEmail}
            src={emailTicket.matchedUser?.profilePic}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="text-foreground font-medium">
              {emailTicket.senderName || emailTicket.senderEmail}
            </div>
            <div className="text-muted-foreground text-sm">
              {emailTicket.senderEmail}
            </div>
          </div>
          {emailTicket.matchedUser && (
            <Badge variant="secondary" size="sm">
              {translate('emailTickets.matchedUser')}
            </Badge>
          )}
        </div>

        {/* Metadata rows */}
        <div className="space-y-0.5">
          <div className="flex h-8 items-center">
            <span className="text-muted-foreground w-20 shrink-0 text-sm">
              {translate('emailTickets.status')}
            </span>
            <Badge variant={badgeConfig.variant} size="sm">
              {translate(badgeConfig.labelKey)}
            </Badge>
          </div>
          <div className="flex h-8 items-center">
            <span className="text-muted-foreground w-20 shrink-0 text-sm">
              {translate('emailTickets.received')}
            </span>
            <span className="text-sm">
              {formatDateTime(emailTicket.receivedAt, language)}
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Icon name="mail" size="sm" className="text-muted-foreground" />
            <span className="text-muted-foreground text-xs font-medium uppercase">
              {translate('emailTickets.body')}
            </span>
          </div>
          <div className="bg-muted/30 max-h-96 overflow-y-auto rounded-lg border p-4 text-sm whitespace-pre-wrap">
            {emailTicket.body || '(No content)'}
          </div>
        </div>

        {/* Converted Info */}
        {emailTicket.status === EmailTicketStatus.CONVERTED &&
          emailTicket.convertedTicketId && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3">
              <Icon
                name="check-circle"
                size="md"
                className="shrink-0 text-green-600"
              />
              <div className="flex-1 text-sm">
                <span className="text-muted-foreground">
                  {translate('emailTickets.convertedTo')}
                </span>
              </div>
              <Link
                to={PAGE_ROUTES.TICKETS.detail(
                  emailTicket.convertedTicketId as TicketId
                )}
                className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                {emailTicket.convertedTicketId}
                <Icon name="arrow-right" size="xs" />
              </Link>
            </div>
          )}

        {/* Dismissed Info */}
        {emailTicket.status === EmailTicketStatus.DISMISSED &&
          emailTicket.dismissedBy && (
            <div className="bg-muted/30 flex items-center gap-3 rounded-lg border p-3">
              <Icon
                name="close"
                size="md"
                className="text-muted-foreground shrink-0"
              />
              <div className="text-muted-foreground text-sm">
                {translate('emailTickets.dismissedBy', {
                  name: emailTicket.dismissedBy.name,
                })}
                {emailTicket.dismissedAt && (
                  <span>
                    {' '}
                    &middot; {formatDateTime(emailTicket.dismissedAt, language)}
                  </span>
                )}
              </div>
            </div>
          )}
      </div>
    </SideDialog>
  );
}
