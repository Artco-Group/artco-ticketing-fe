import type { FormEvent } from 'react';
import {
  type Comment,
  type User,
  formatDateTime,
} from '@artco-group/artco-ticketing-sync';
import { useAutoScroll, EmptyState } from '@/shared';

interface CommentThreadProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  currentUser: User | null;
}

function CommentThread({
  comments,
  newComment,
  onCommentChange,
  onSubmit,
  currentUser,
}: CommentThreadProps) {
  const commentsContainerRef = useAutoScroll(comments);

  return (
    <div className="card p-8">
      <h2 className="text-greyscale-900 mb-6 text-lg font-semibold">
        Diskusija
      </h2>

      {/* Comments List */}
      <div
        ref={commentsContainerRef}
        className="mb-6 max-h-96 space-y-4 overflow-y-auto"
      >
        {comments.length === 0 ? (
          <EmptyState
            variant="no-comments"
            title="No comments yet"
            message="Be the first to start the discussion"
            className="min-h-0 py-8"
          />
        ) : (
          comments.map((comment) => (
            <CommentBubble
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
            />
          ))
        )}
        <div />
      </div>

      {/* Add Comment Form */}
      <form onSubmit={onSubmit} className="flex gap-3">
        <textarea
          id="new-comment"
          name="new-comment"
          autoComplete="off"
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Napišite odgovor..."
          rows={2}
          className="focus:border-brand-primary focus:ring-brand-primary/10 text-greyscale-900 flex-1 resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="btn-primary self-end px-5 py-3"
        >
          Pošalji
        </button>
      </form>
    </div>
  );
}

interface CommentBubbleProps {
  comment: Comment;
  currentUser: User | null;
}

function CommentBubble({ comment, currentUser }: CommentBubbleProps) {
  const thisUser =
    comment.authorId._id === (currentUser?.id || currentUser?._id);
  return (
    <div className={`flex ${thisUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-xl p-4 ${
          thisUser
            ? 'bg-brand-primary rounded-br-sm text-white'
            : 'text-greyscale-900 rounded-bl-sm bg-gray-100'
        }`}
      >
        <div className="flex-start-gap-2 mb-2">
          <span
            className={`text-xs font-medium ${thisUser ? 'text-white/80' : 'text-greyscale-500'}`}
          >
            {thisUser ? 'You' : comment.authorId.name}
          </span>
          <span
            className={`text-xs ${thisUser ? 'text-white/60' : 'text-greyscale-400'}`}
          >
            {comment.updatedAt ? formatDateTime(comment.updatedAt) : ''}
          </span>
        </div>
        <p
          className={`text-sm leading-relaxed ${thisUser ? 'text-white' : 'text-greyscale-700'}`}
        >
          {comment.text}
        </p>
      </div>
    </div>
  );
}

export default CommentThread;
