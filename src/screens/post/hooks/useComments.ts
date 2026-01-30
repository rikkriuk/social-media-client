import { useState, useCallback } from "react";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import type { Comment } from "@/types/comment";

const COMMENTS_PER_PAGE = 20;

interface UseCommentsProps {
   postId: string;
   initialComments: Comment[];
   initialTotal?: number;
   currentProfileId: string | null;
   t: (key: string) => string | undefined;
}

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

   const hasMore = comments.length < total;

   const submitComment = useCallback(async () => {
      if (!commentText.trim() || !currentProfileId) return;

      setIsSending(true);
      try {
         const response = await webRequest.post("/comments", {
            postId,
            content: commentText.trim(),
         });

         if (response.data?.ok) {
            const newComment: Comment = response.data.data;
            // Attach current user profile info for immediate display
            if (newComment && !newComment.profile) {
               newComment.profile = { id: currentProfileId, name: "" };
            }
            setComments((prev) => [newComment, ...prev]);
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
   }, [commentText, currentProfileId, postId, t]);

   const deleteComment = useCallback(async (commentId: string) => {
      try {
         const response = await webRequest.delete(`/comments/${commentId}`);

         if (response.data?.ok) {
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            setTotal((prev) => prev - 1);
            toast.success(t("commentDeleted"));
         } else {
            toast.error(response.data?.message || t("commentDeleteFailed"));
         }
      } catch (error) {
         console.error("Delete comment error:", error);
         toast.error(t("commentDeleteFailed"));
      }
   }, [t]);

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

   return {
      comments,
      commentText,
      setCommentText,
      isSending,
      isLoadingMore,
      hasMore,
      total,
      submitComment,
      deleteComment,
      loadMore,
   };
};
