import { asTicketId } from '@/types';
import { cn } from '@/lib/utils';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useComments } from '../hooks/useComments';

interface TicketDiscussionProps {
  ticketId: string;
  currentUserId: string;
}

function TicketDiscussion({ ticketId, currentUserId }: TicketDiscussionProps) {
  const commentsHook = useComments({
    ticketId: asTicketId(ticketId),
    currentUserId,
  });

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">Discussion</h3>
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
          <p className="text-muted-foreground mb-2 text-sm">Editing comment</p>
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
                ? `Reply to ${commentsHook.replyingToComment.authorId?.name || 'Unknown'}`
                : 'Add Comment...'
          }
          initialValue={
            commentsHook.isEditing
              ? commentsHook.editingComment.text
              : undefined
          }
          submitLabel={
            commentsHook.isEditing
              ? 'Save'
              : commentsHook.isReplying
                ? 'Reply'
                : 'Send'
          }
          disabled={commentsHook.isSubmitting}
          isLoading={commentsHook.isSubmitting}
        />
      </div>
    </div>
  );
}

export default TicketDiscussion;
