import { useState, useCallback } from "react";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import type { Comment, EditingComment, ReplyTarget, UseCommentsProps } from "@/types/comment";

const COMMENTS_PER_PAGE = 20;

export const useComments = ({
   postId,
   initialComments,
   initialTotal,
   currentProfileId,
   t,
}: UseCommentsProps) => {
   const [comments, setComments] = useState<Comment[]>(initialComments);
   const [commentText, setCommentText] = useState("");
   const [isSending, setIsSending] = useState(false);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [total, setTotal] = useState(initialTotal ?? initialComments.length);
   const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
   const [editingComment, setEditingComment] = useState<EditingComment | null>(null);

   const hasMore = comments.length < total;

   const submitComment = useCallback(async () => {
      if (!commentText.trim() || !currentProfileId) return;

      setIsSending(true);
      try {
         const body: { postId: string; content: string; parentId?: string } = {
            postId,
            content: commentText.trim(),
         };
         if (replyTarget) {
            body.parentId = replyTarget.commentId;
         }

         const response = await webRequest.post("/comments", body);

         if (response.data?.ok) {
            const newComment: Comment = response.data.data;
            if (newComment && !newComment.profile) {
               newComment.profile = { id: currentProfileId, name: "" };
            }

            if (replyTarget) {
               setComments((prev) =>
                  prev.map((c) =>
                     c.id === replyTarget.commentId
                        ? { ...c, replies: [...(c.replies || []), newComment] }
                        : c
                  )
               );
               setReplyTarget(null);
            } else {
               setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
            }
            setTotal((prev) => prev + 1);
            setCommentText("");
            toast.success(t("commentPosted"));
         } else {
            toast.error(response.data?.message || t("commentFailed"));
         }
      } catch (error) {
         console.error("Comment error:", error);
         toast.error(t("commentFailed"));
      } finally {
         setIsSending(false);
      }
   }, [commentText, currentProfileId, postId, t, replyTarget]);

   const deleteComment = useCallback(async (commentId: string) => {
      try {
         const response = await webRequest.delete(`/comments/${commentId}`);

         if (response.data?.ok) {
            const topLevel = comments.find((c) => c.id === commentId);
            if (topLevel) {
               const replyCount = topLevel.replies?.length || 0;
               setComments((prev) => prev.filter((c) => c.id !== commentId));
               setTotal((prev) => prev - 1 - replyCount);
            } else {
               setComments((prev) =>
                  prev.map((c) => ({
                     ...c,
                     replies: c.replies?.filter((r) => r.id !== commentId),
                  }))
               );
               setTotal((prev) => prev - 1);
            }
            toast.success(t("commentDeleted"));
         } else {
            toast.error(response.data?.message || t("commentDeleteFailed"));
         }
      } catch (error) {
         console.error("Delete comment error:", error);
         toast.error(t("commentDeleteFailed"));
      }
   }, [t, comments]);

   const loadMore = useCallback(async () => {
      if (isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);
      try {
         const response = await webRequest.get("/comments", {
            params: {
               postId,
               limit: COMMENTS_PER_PAGE,
               offset: comments.length,
            },
         });

         if (response.data?.ok) {
            const { data, total: newTotal } = response.data.data;
            setComments((prev) => [...prev, ...data]);
            setTotal(newTotal);
         }
      } catch (error) {
         console.error("Load more comments error:", error);
      } finally {
         setIsLoadingMore(false);
      }
   }, [postId, comments.length, isLoadingMore, hasMore]);

   const startReply = useCallback((commentId: string, profileName: string) => {
      setReplyTarget({ commentId, profileName });
   }, []);

   const cancelReply = useCallback(() => {
      setReplyTarget(null);
   }, []);

   const startEdit = useCallback((commentId: string) => {
      // Find the comment in top-level or nested replies
      const topLevel = comments.find((c) => c.id === commentId);
      if (topLevel) {
         setEditingComment({ id: commentId, content: topLevel.content });
         return;
      }
      for (const c of comments) {
         const reply = c.replies?.find((r) => r.id === commentId);
         if (reply) {
            setEditingComment({ id: commentId, content: reply.content });
            return;
         }
      }
   }, [comments]);

   const cancelEdit = useCallback(() => {
      setEditingComment(null);
   }, []);

   const submitEdit = useCallback(async (commentId: string, newContent: string) => {
      if (!newContent.trim()) return;

      try {
         const response = await webRequest.patch(`/comments/${commentId}`, {
            content: newContent.trim(),
         });

         if (response.data?.ok) {
            setComments((prev) =>
               prev.map((c) => {
                  if (c.id === commentId) {
                     return { ...c, content: newContent.trim() };
                  }
                  if (c.replies) {
                     return {
                        ...c,
                        replies: c.replies.map((r) =>
                           r.id === commentId ? { ...r, content: newContent.trim() } : r
                        ),
                     };
                  }
                  return c;
               })
            );
            setEditingComment(null);
            toast.success(t("commentEdited"));
         } else {
            toast.error(response.data?.message || t("editFailed"));
         }
      } catch (error) {
         console.error("Edit comment error:", error);
         toast.error(t("editFailed"));
      }
   }, [t]);

   return {
      comments,
      commentText,
      setCommentText,
      isSending,
      isLoadingMore,
      hasMore,
      total,
      replyTarget,
      editingComment,
      submitComment,
      deleteComment,
      loadMore,
      startReply,
      cancelReply,
      startEdit,
      cancelEdit,
      submitEdit,
   };
};
