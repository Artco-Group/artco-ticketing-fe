import { useEffect, useRef } from 'react';
import { formatDateTime } from '../../utils/ticketHelpers';
function CommentThread({
  comments,
  newComment,
  onCommentChange,
  onSubmit,
  currentUser,
}) {
  const commentsContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Diskusija</h2>

      {/* Comments List */}
      <div
        ref={commentsContainerRef}
        className="mb-6 max-h-96 space-y-4 overflow-y-auto"
      >
        {comments.length === 0 ? (
          <p className="py-8 text-center text-gray-400">Nema komentara</p>
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
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Napišite odgovor..."
          rows={2}
          className="flex-1 resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="self-end rounded-lg bg-[#004179] px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pošalji
        </button>
      </form>
    </div>
  );
}

function CommentBubble({ comment, currentUser }) {
  const thisUser =
    comment.authorId._id === (currentUser?.id || currentUser?._id);
  console.log('=== CommentBubble Debug ===');
  console.log('currentUser:', currentUser);
  console.log('thisUser:', thisUser ? 'true' : 'false');
  return (
    <div className={`flex ${thisUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-xl p-4 ${
          thisUser
            ? 'rounded-br-sm bg-[#004179] text-white'
            : 'rounded-bl-sm bg-gray-100 text-gray-900'
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`text-xs font-medium ${thisUser ? 'text-white/80' : 'text-gray-500'}`}
          >
            {thisUser ? 'You' : comment.authorId.name}
          </span>
          <span
            className={`text-xs ${thisUser ? 'text-white/60' : 'text-gray-400'}`}
          >
            {formatDateTime(comment.updatedAt)}
          </span>
        </div>
        <p
          className={`text-sm leading-relaxed ${thisUser ? 'text-white' : 'text-gray-700'}`}
        >
          {comment.text}
        </p>
      </div>
    </div>
  );
}

export default CommentThread;
