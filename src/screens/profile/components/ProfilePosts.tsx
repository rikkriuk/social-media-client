import { useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { ProfilePostsProps } from "@/types/profile";

interface ProfilePostsExtendedProps extends ProfilePostsProps {
   totalPosts?: number;
}

export const ProfilePosts = ({
   posts,
   profileData,
   initialUser,
   currentProfileId,
   formatPostTime,
   onLikeChange,
   isOwnProfile,
   t,
   totalPosts = 0,
}: ProfilePostsExtendedProps) => {
   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
   const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

   const { displayItems: displayPosts, isLoadingMore, endRef, hasMoreItems } = useInfiniteScroll({
      items: posts,
      totalItems: totalPosts,
      itemsPerPage: 5,
   });

   const handleDeletePost = async (postId: string) => {
      if (!isDeleteConfirming) {
         setSelectedPostId(postId);
         setIsDeleteConfirming(true);
         return;
      }

      // try {
      //    const response = await httpRequest.delete("/post/delete", {
      //       data: { postId },
      //    });

      //    if (response.data.ok) {
      //       toast.success(t("postDeleted") || "Postingan berhasil dihapus");
      //       setDisplayPosts((prev) => prev.filter((p) => p.id !== postId));
      //    } else {
      //       toast.error(response.data.message || t("deleteFailed"));
      //    }
      // } catch (error: any) {
      //    console.error("Delete error:", error);
      //    toast.error(error?.data?.message || t("deleteFailed"));
      // } finally {
      //    setIsDeleteConfirming(false);
      //    setSelectedPostId(null);
      // }
   };

   const handleEditPost = (postId: string) => {
      toast.info("Edit post feature coming soon");
   };

   const handleViewPostDetail = (postId: string) => {
      toast.info("View post detail feature coming soon");
   };

   if (posts.length === 0) {
      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">{t("noPostsYet")}</p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {displayPosts.map((post) => (
            <div key={post.id} className="relative">
               {isDeleteConfirming && selectedPostId === post.id && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-50">
                     <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                        <p className="text-gray-900 dark:text-white font-medium mb-4">
                           {t("confirmDelete") || "Hapus postingan ini?"}
                        </p>
                        <div className="flex gap-2">
                           <button
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                              onClick={() => {
                                 setIsDeleteConfirming(false);
                                 setSelectedPostId(null);
                              }}
                           >
                              {t("cancel") || "Batal"}
                           </button>
                           <button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              onClick={() => handleDeletePost(post.id)}
                           >
                              {t("delete") || "Hapus"}
                           </button>
                        </div>
                     </div>
                  </div>
               )}
               <PostCard
                  key={post.id}
                  postId={post.id}
                  profileId={currentProfileId || undefined}
                  author={{
                     name: profileData.name || initialUser.username,
                     avatar: undefined,
                     time: formatPostTime(post.createdAt),
                  }}
                  content={post.content}
                  image={post.image}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  shares={post.sharesCount}
                  initialIsLiked={post.isLiked}
                  onLikeChange={onLikeChange}
                  isOwnPost={isOwnProfile}
                  onViewDetails={() => handleViewPostDetail(post.id)}
                  onEdit={() => handleEditPost(post.id)}
                  onDelete={() => handleDeletePost(post.id)}
               />
            </div>
         ))}

         <div ref={endRef} className="flex justify-center py-8">
            {isLoadingMore && (
               <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            )}
            {!hasMoreItems && displayPosts.length > 0 && (
               <p className="text-gray-500 text-sm">{t("noMorePosts")}</p>
            )}
         </div>
      </div>
   );
};