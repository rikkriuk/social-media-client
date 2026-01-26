import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { httpRequest } from "@/helpers/api";
import type { ProfilePostsProps } from "@/types/profile";

export const ProfilePosts = ({
   posts,
   profileData,
   initialUser,
   currentProfileId,
   formatPostTime,
   onLikeChange,
   isOwnProfile,
   t,
}: ProfilePostsProps) => {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const currentPage = parseInt(searchParams.get("page") || "1", 10);
   
   // Extract profileId from URL: /profile/[id] -> id
   const profileId = pathname.split("/").pop() || "";
   
   const [displayPosts, setDisplayPosts] = useState(posts);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
   const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
   const [hasMorePosts, setHasMorePosts] = useState(posts.length >= 5);
   const endRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      setDisplayPosts(posts);
      setHasMorePosts(posts.length >= 5);
   }, [posts]);

   // Infinite scroll observer
   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            if (
               entries[0].isIntersecting &&
               hasMorePosts &&
               !isLoadingMore
            ) {
               loadMorePosts();
            }
         },
         { threshold: 0.1 }
      );

      if (endRef.current) {
         observer.observe(endRef.current);
      }

      return () => observer.disconnect();
   }, [hasMorePosts, isLoadingMore]);

   const loadMorePosts = () => {
      setIsLoadingMore(true);
      // Update URL to next page
      const nextPage = currentPage + 1;
      router.push(`/profile/${profileId}?page=${nextPage}`);
      setIsLoadingMore(false);
   };

   const handleDeletePost = async (postId: string) => {
      if (!isDeleteConfirming) {
         setSelectedPostId(postId);
         setIsDeleteConfirming(true);
         return;
      }

      try {
         const response = await httpRequest.delete("/post/delete", {
            data: { postId },
         });

         if (response.data.ok) {
            toast.success(t("postDeleted") || "Postingan berhasil dihapus");
            setDisplayPosts((prev) => prev.filter((p) => p.id !== postId));
         } else {
            toast.error(response.data.message || t("deleteFailed"));
         }
      } catch (error: any) {
         console.error("Delete error:", error);
         toast.error(error?.data?.message || t("deleteFailed"));
      } finally {
         setIsDeleteConfirming(false);
         setSelectedPostId(null);
      }
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

         {/* Infinite scroll trigger */}
         <div ref={endRef} className="flex justify-center py-8">
            {isLoadingMore && (
               <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            )}
            {!hasMorePosts && displayPosts.length > 0 && (
               <p className="text-gray-500 text-sm">{t("noMorePosts")}</p>
            )}
         </div>
      </div>
   );
};
