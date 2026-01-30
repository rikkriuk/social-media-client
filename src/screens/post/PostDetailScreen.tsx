"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Share2, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { webRequest } from "@/helpers/api";
import { formatRelativeTime } from "@/helpers/date";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import type { Post } from "@/types/profile";

interface Comment {
   id: string;
   postId: string;
   profileId: string;
   content: string;
   likesCount: number;
   createdAt: string;
   profile?: {
      id: string;
      name: string;
      avatar?: string;
   };
}

interface PostDetailScreenProps {
   post: Post;
   initialComments: Comment[];
   currentProfileId: string | null;
}

export default function PostDetailScreen({
   post,
   initialComments,
   currentProfileId,
}: PostDetailScreenProps) {
   const router = useRouter();
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "post");
   const { t: tDate } = useTranslationCustom(lng, "date");

   const [comments, setComments] = useState<Comment[]>(initialComments);
   const [commentText, setCommentText] = useState("");
   const [isSending, setIsSending] = useState(false);
   const [likesCount, setLikesCount] = useState(post.likesCount);
   const [isLiked, setIsLiked] = useState(post.isLiked || false);

   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
   const mediaIds = Array.isArray(post.mediaIds) ? post.mediaIds : [];

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

   const handleSubmitComment = useCallback(async () => {
      if (!commentText.trim() || !currentProfileId) return;

      setIsSending(true);
      try {
         const response = await webRequest.post("/comments", {
            postId: post.id,
            content: commentText.trim(),
         });

         if (response.data) {
            setComments((prev) => [response.data, ...prev]);
            setCommentText("");
            toast.success(t("commentPosted"));
         }
      } catch (error) {
         console.error("Comment error:", error);
         toast.error(t("commentFailed"));
      } finally {
         setIsSending(false);
      }
   }, [commentText, currentProfileId, post.id, t]);

   const profileName = post.profile?.name || "User";
   const profileImage = post.profile?.profileImage
      ? `${baseUrl}/uploads/${post.profile.profileImage}`
      : null;

   return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm max-w-4xl flex-1 mx-auto min-h-screen pb-20 md:pb-6">
         {/* Header */}
         <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => router.back()}
               >
                  <ArrowLeft className="w-5 h-5" />
               </Button>
               <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("postDetail")}
               </h1>
            </div>
         </div>

         {/* Post Content */}
         <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4">
               {/* Author */}
               <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                     {profileImage && (
                        <AvatarImage src={profileImage} alt={profileName} />
                     )}
                     <AvatarFallback>
                        {profileName.charAt(0).toUpperCase()}
                     </AvatarFallback>
                  </Avatar>
                  <div>
                     <p className="font-semibold text-gray-900 dark:text-white">{profileName}</p>
                     <p className="text-sm text-gray-500">
                        {formatRelativeTime(post.createdAt, tDate)}
                     </p>
                  </div>
               </div>

               {/* Content */}
               <p className="text-gray-900 dark:text-white whitespace-pre-wrap mb-4">
                  {post.content}
               </p>

               {/* Images */}
               {mediaIds.length > 0 && (
                  <div className={`mb-4 ${mediaIds.length === 1 ? "" : "grid grid-cols-2 gap-1"} rounded-xl overflow-hidden`}>
                     {mediaIds.map((filename, index) => (
                        <img
                           key={index}
                           src={`${baseUrl}/uploads/${filename}`}
                           alt={`Post image ${index + 1}`}
                           className="w-full object-cover max-h-96"
                        />
                     ))}
                  </div>
               )}

               {/* Actions */}
               <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                     onClick={handleLikeToggle}
                     className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                     <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                     <span className="text-sm">{likesCount}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-500">
                     <MessageCircle className="w-5 h-5" />
                     <span className="text-sm">{comments.length}</span>
                  </div>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                     <Share2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>

         {/* Comment Input */}
         {currentProfileId && (
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
               <div className="flex gap-3">
                  <Textarea
                     placeholder={t("writeComment")}
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     className="flex-1 resize-none border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800"
                     rows={2}
                  />
                  <Button
                     size="icon"
                     className="rounded-full bg-blue-600 hover:bg-blue-700 text-white self-end"
                     onClick={handleSubmitComment}
                     disabled={!commentText.trim() || isSending}
                  >
                     {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                     ) : (
                        <Send className="w-4 h-4" />
                     )}
                  </Button>
               </div>
            </div>
         )}

         {/* Comments List */}
         <div className="bg-white dark:bg-gray-900">
            {comments.length === 0 ? (
               <div className="px-4 py-8 text-center">
                  <p className="text-gray-500 text-sm">{t("noComments")}</p>
               </div>
            ) : (
               <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {comments.map((comment) => (
                     <div key={comment.id} className="px-4 py-3">
                        <div className="flex gap-3">
                           <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                 {(comment.profile?.name || "U").charAt(0).toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                                 <p className="font-medium text-sm text-gray-900 dark:text-white">
                                    {comment.profile?.name || "User"}
                                 </p>
                                 <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {comment.content}
                                 </p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1 ml-3">
                                 {formatRelativeTime(comment.createdAt, tDate)}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
