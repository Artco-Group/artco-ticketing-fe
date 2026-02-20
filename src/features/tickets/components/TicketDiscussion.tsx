import { asTicketId } from '@/types';
import { cn } from '@/lib/utils';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useComments } from '../hooks/useComments';
import { useAppTranslation } from '@/shared/hooks';

interface TicketDiscussionProps {
  ticketId: string;
  currentUserId: string;
}

function TicketDiscussion({ ticketId, currentUserId }: TicketDiscussionProps) {
  const { translate } = useAppTranslation('tickets');
  const { translate: translateCommon } = useAppTranslation('common');
  const commentsHook = useComments({
    ticketId: asTicketId(ticketId),
    currentUserId,
  });

  const replyToName =
    commentsHook.replyingToComment?.authorId?.name ||
    translateCommon('unknownUser');

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">
        {translate('comments.discussion')}
      </h3>
      <CommentList
        comments={commentsHook.comments}
        groupedComments={commentsHook.groupedComments}
        currentUserId={commentsHook.currentUserId}
        onReply={commentsHook.onReply}
        onEdit={commentsHook.onEdit}
        onDelete={commentsHook.onDelete}
        getCommentTimeDisplay={commentsHook.getCommentTimeDisplay}
      />
      <div className={cn(commentsHook.isEditing && 'mt-4 border-t pt-4')}>
        {commentsHook.isEditing && (
          <p className="text-muted-foreground mb-2 text-sm">
            {translate('comments.editingComment')}
          </p>
        )}
        <CommentForm
          onSubmit={commentsHook.onSubmit}
          onCancel={
            commentsHook.isEditing
              ? commentsHook.onCancelEdit
              : commentsHook.isReplying
                ? commentsHook.onCancelReply
                : undefined
          }
          placeholder={
            commentsHook.isEditing
              ? undefined
              : commentsHook.isReplying && commentsHook.replyingToComment
                ? translate('comments.replyTo', { name: replyToName })
                : translate('comments.addComment')
          }
          initialValue={
            commentsHook.isEditing
              ? commentsHook.editingComment.text
              : undefined
          }
          submitLabel={
            commentsHook.isEditing
              ? translate('comments.save')
              : commentsHook.isReplying
                ? translate('comments.reply')
                : translate('comments.send')
          }
          disabled={commentsHook.isSubmitting}
          isLoading={commentsHook.isSubmitting}
        />
      </div>
    </div>
  );
}

export default TicketDiscussion;
