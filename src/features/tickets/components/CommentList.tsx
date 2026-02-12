import { memo, useRef, useEffect } from 'react';
import { asCommentId, type Comment, type CommentId } from '@/types';
import { Avatar } from '@/shared/components/ui/Avatar';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Separator } from '@/shared/components/ui/separator';
import { Icon } from '@/shared/components/ui';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CommentListProps {
  comments: Comment[];
  groupedComments: { [key: string]: Comment[] };
  currentUserId: string;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: CommentId) => void;
  getCommentTimeDisplay: (comment: Comment) => string;
}

interface CommentItemProps {
  comment: Comment;
  commentId: CommentId;
  isCurrentUser: boolean;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: CommentId) => void;
  getCommentTimeDisplay: (comment: Comment) => string;
}

const CommentItem = memo(function CommentItem({
  comment,
  commentId,
  isCurrentUser,
  onReply,
  onEdit,
  onDelete,
  getCommentTimeDisplay,
}: CommentItemProps) {
  const authorName = comment.authorId?.name || 'Unknown User';

  return (
    <div
      className={cn(
        'mb-4 flex',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex max-w-[70%] items-start gap-2">
        {!isCurrentUser && <Avatar size="md" alt={authorName} />}

        <div className="flex-1">
          <div
            className={cn(
              'relative overflow-hidden rounded-xl p-4',
              isCurrentUser
                ? 'bg-brand-primary/75 rounded-br-sm text-white'
                : 'text-greyscale-900 rounded-bl-sm bg-gray-100',
              // White gradient overlay
              'before:pointer-events-none before:absolute before:inset-0 before:z-1'
            )}
          >
            <div className="relative z-2">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {isCurrentUser ? 'You' : authorName}
                  </span>
                  <span
                    className={cn(
                      'text-xs',
                      isCurrentUser ? 'text-white/70' : 'text-greyscale-600'
                    )}
                  >
                    {getCommentTimeDisplay(comment)}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        '-mr-1 rounded-md p-1 transition-colors',
                        isCurrentUser
                          ? 'hover:bg-white/20'
                          : 'hover:bg-greyscale-200'
                      )}
                      aria-label="Options"
                    >
                      <Icon
                        name="more-horizontal"
                        size="md"
                        className={cn(
                          isCurrentUser ? 'text-white' : 'text-greyscale-700'
                        )}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onReply(commentId)}>
                      <span>Reply</span>
                    </DropdownMenuItem>
                    {isCurrentUser && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onEdit(commentId, comment.text)}
                        >
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(commentId)}
                          className="text-destructive focus:text-destructive"
                        >
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reply Context Bubble - if this comment is a reply */}
              {comment.replyId && (
                <div
                  className={cn(
                    'mb-2 rounded-lg px-3 py-2 text-xs',
                    isCurrentUser
                      ? 'border border-white/30 bg-white/20'
                      : 'border-greyscale-200 border bg-white'
                  )}
                >
                  <div className="mb-1 flex items-center gap-1">
                    <span
                      className={cn(
                        'font-medium',
                        isCurrentUser ? 'text-white/90' : 'text-greyscale-700'
                      )}
                    >
                      Replied to {comment.replyId.authorId?.name || 'Unknown'}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'line-clamp-2',
                      isCurrentUser ? 'text-white/70' : 'text-greyscale-600'
                    )}
                  >
                    {comment.replyId.text}
                  </p>
                </div>
              )}

              <p className="text-sm wrap-break-word whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        </div>

        {isCurrentUser && <Avatar size="md" alt={authorName} />}
      </div>
    </div>
  );
});

export function CommentList({
  comments,
  groupedComments,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  getCommentTimeDisplay,
}: CommentListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments.length]);

  if (comments.length === 0) {
    return (
      <EmptyState
        title="No comments"
        message="Be the first to start discussion"
        className="min-h-0 py-8"
      />
    );
  }

  const dateKeys = Object.keys(groupedComments);

  return (
    <div
      ref={scrollRef}
      className="custom-scrollbar max-h-96 overflow-y-auto pr-2"
    >
      {dateKeys.map((dateKey) => (
        <div key={dateKey}>
          {/* Date Separator */}
          <div className="my-4 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground px-2 text-xs font-medium">
              {dateKey}
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Comments for this date */}
          <div className="space-y-1">
            {groupedComments[dateKey].map((comment) => {
              const commentId = asCommentId(comment.id);
              const authorId = comment.authorId?.id || '';
              const isCurrentUser = authorId === currentUserId;

              return (
                <CommentItem
                  key={commentId}
                  comment={comment}
                  commentId={commentId}
                  isCurrentUser={isCurrentUser}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  getCommentTimeDisplay={getCommentTimeDisplay}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
export default CommentList;
