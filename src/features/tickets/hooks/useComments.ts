import { useState, useMemo } from 'react';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import { formatDateTime } from '@artco-group/artco-ticketing-sync';
import {
  useComments as useCommentsQuery,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
} from '../api/comments-api';
import {
  asCommentId,
  type TicketId,
  type CommentId,
  type Comment,
} from '@/types';

interface UseCommentsProps {
  ticketId: TicketId;
  currentUserId: string;
}

interface CommentEditState {
  commentId: CommentId | null;
  text: string;
}

/**
 * Custom hook for managing comments functionality.
 * Handles all comment actions for CommentList and CommentForm components.
 */
export function useComments({ ticketId, currentUserId }: UseCommentsProps) {
  const toast = useToast();

  // State for editing comments
  const [editingComment, setEditingComment] = useState<CommentEditState>({
    commentId: null,
    text: '',
  });

  // State for reply mode
  const [replyingToCommentId, setReplyingToCommentId] =
    useState<CommentId | null>(null);

  // Fetch comments
  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useCommentsQuery(ticketId);

  // Mutations
  const addCommentMutation = useAddComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const comments = useMemo(
    () => commentsData?.comments || [],
    [commentsData?.comments]
  );

  /**
   * Handle adding a new comment
   */
  const handleAddComment = async (text: string) => {
    try {
      const payload: any = {
        ticketId,
        text,
      };

      if (replyingToCommentId) {
        payload.replyId = String(replyingToCommentId);
      }

      await addCommentMutation.mutateAsync(payload);
      toast.success('Komentar uspješno dodan');
      // Clear reply state after successful add
      setReplyingToCommentId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  /**
   * Handle updating an existing comment
   */
  const handleUpdateComment = async (text: string) => {
    if (!editingComment.commentId) return;

    try {
      await updateCommentMutation.mutateAsync({
        commentId: editingComment.commentId,
        text,
      });
      toast.success('Komentar uspješno ažuriran');
      // Clear editing state
      setEditingComment({ commentId: null, text: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  /**
   * Handle deleting a comment
   */
  const handleDeleteComment = async (commentId: CommentId) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      toast.success('Komentar uspješno obrisan');
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  /**
   * Handle starting edit mode for a comment
   */
  const handleStartEdit = (commentId: string, text: string) => {
    setEditingComment({
      commentId: asCommentId(commentId),
      text,
    });
    // Clear reply state when starting edit
    setReplyingToCommentId(null);
  };

  /**
   * Handle canceling edit mode
   */
  const handleCancelEdit = () => {
    setEditingComment({ commentId: null, text: '' });
  };

  /**
   * Handle starting reply mode for a comment
   */
  const handleStartReply = (commentId: string) => {
    setReplyingToCommentId(asCommentId(commentId));
    // Clear edit state when starting reply
    setEditingComment({ commentId: null, text: '' });
  };

  /**
   * Handle canceling reply mode
   */
  const handleCancelReply = () => {
    setReplyingToCommentId(null);
  };

  /**
   * Handle form submission (either add or update)
   */
  const handleCommentSubmit = async (text: string) => {
    if (editingComment.commentId) {
      await handleUpdateComment(text);
    } else {
      await handleAddComment(text);
    }
  };

  /**
   * Check if a comment is currently being edited
   */
  const isCommentBeingEdited = (commentId: string) => {
    return editingComment.commentId === asCommentId(commentId);
  };

  /**
   * Check if replying to a specific comment
   */
  const isReplyingToComment = (commentId: string) => {
    return replyingToCommentId === asCommentId(commentId);
  };

  /**
   * Get the comment being replied to (for display in CommentForm)
   */
  const getReplyingToComment = () => {
    if (!replyingToCommentId) return null;
    return comments.find((c) => c.id === replyingToCommentId) || null;
  };

  /**
   * Helper function to format date for grouping
   */
  const formatDateKey = (date: string | Date | undefined): string => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "DD.MM.YYYY"
      return d.toLocaleDateString('en-GB');
    }
  };

  /**
   * Group comments by date
   */
  const groupedComments = useMemo(() => {
    const groups: { [key: string]: Comment[] } = {};

    comments.forEach((comment) => {
      const dateKey = formatDateKey(comment.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(comment);
    });

    return groups;
  }, [comments]);

  /**
   * Check if a comment was edited
   */
  const isCommentEdited = (comment: Comment): boolean => {
    return !!(
      comment.createdAt &&
      comment.updatedAt &&
      new Date(comment.createdAt).getTime() !==
        new Date(comment.updatedAt).getTime()
    );
  };

  /**
   * Get time display for a comment (handles edited status)
   */
  const getCommentTimeDisplay = (comment: Comment): string => {
    const edited = isCommentEdited(comment);

    if (edited && comment.updatedAt) {
      // Extract just the time from formatDateTime
      const fullDateTime = formatDateTime(comment.updatedAt);
      const timeMatch = fullDateTime.match(/\d{2}:\d{2}/);
      return timeMatch ? `Edited: ${timeMatch[0]}` : `Edited: ${fullDateTime}`;
    }
    if (comment.createdAt) {
      const fullDateTime = formatDateTime(comment.createdAt);
      const timeMatch = fullDateTime.match(/\d{2}:\d{2}/);
      return timeMatch ? timeMatch[0] : fullDateTime;
    }
    return '—';
  };

  return {
    // Data
    comments,
    currentUserId,
    groupedComments,

    // Loading states
    isLoading: commentsLoading,
    isSubmitting:
      addCommentMutation.isPending || updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,

    // Edit state
    editingComment,
    isEditing: !!editingComment.commentId,

    // Reply state
    replyingToCommentId,
    isReplying: !!replyingToCommentId,
    replyingToComment: getReplyingToComment(),

    // Actions for CommentList
    onReply: handleStartReply,
    onEdit: handleStartEdit,
    onDelete: handleDeleteComment,

    // Actions for CommentForm
    onSubmit: handleCommentSubmit,
    onCancelEdit: handleCancelEdit,
    onCancelReply: handleCancelReply,

    // Helper functions
    isCommentBeingEdited,
    isReplyingToComment,
    isCommentEdited,
    getCommentTimeDisplay,

    // Refetch function
    refetch: refetchComments,
  };
}
