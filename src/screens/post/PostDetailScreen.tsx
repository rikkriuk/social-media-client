"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { webRequest } from "@/helpers/api";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { useComments } from "./hooks/useComments";
import { PostDetailHeader } from "./components/PostDetailHeader";
import { PostContent } from "./components/PostContent";
import { CommentInput } from "./components/CommentInput";
import { CommentList } from "./components/CommentList";
import type { PostDetailScreenProps } from "@/types/comment";

export default function PostDetailScreen({
   post,
   initialComments,
   currentProfileId,
}: PostDetailScreenProps) {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "post");
   const { t: tDate } = useTranslationCustom(lng, "date");

   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

   const [likesCount, setLikesCount] = useState(post.likesCount);
   const [isLiked, setIsLiked] = useState(post.isLiked || false);

   const {
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
   } = useComments({
      postId: post.id,
      initialComments,
      currentProfileId,
      t,
   });

   const handleLikeToggle = useCallback(async () => {
      if (!currentProfileId) {
         toast.error(t("loginRequired"));
         return;
      }

      try {
         const response = await webRequest.post("/like", {
            type: isLiked ? "unlike" : "like",
            postId: post.id,
            profileId: currentProfileId,
         });

         if (response.data.ok || response.data) {
            setIsLiked(!isLiked);
            setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
         }
      } catch (error) {
         console.error("Like toggle error:", error);
      }
   }, [isLiked, currentProfileId, post.id, t]);

   return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm max-w-4xl flex-1 mx-auto min-h-screen pb-20 md:pb-6">
         <PostDetailHeader title={t("postDetail") || "Post Detail"} />

         <PostContent
            post={post}
            baseUrl={baseUrl}
            likesCount={likesCount}
            isLiked={isLiked}
            commentsCount={total}
            onLikeToggle={handleLikeToggle}
            tDate={tDate}
         />

         {currentProfileId && (
            <CommentInput
               value={commentText}
               onChange={setCommentText}
               onSubmit={submitComment}
               isSending={isSending}
               placeholder={t("writeComment") || "Write a comment..."}
            />
         )}

         <div className="bg-white dark:bg-gray-900">
            <CommentList
               comments={comments}
               currentProfileId={currentProfileId}
               baseUrl={baseUrl}
               hasMore={hasMore}
               isLoadingMore={isLoadingMore}
               onLoadMore={loadMore}
               onDelete={deleteComment}
               tDate={tDate}
               emptyText={t("noComments") || "No comments yet."}
               loadMoreText={t("loadMore") || "Load more"}
               deleteText={t("deleteComment") || "Delete"}
            />
         </div>
      </div>
   );
}
