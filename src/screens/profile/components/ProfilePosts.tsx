import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { Modal } from "@/components/Modal";
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
   onPostDelete,
   onEditPost,
}: ProfilePostsExtendedProps & { 
   onPostDelete?: (postId: string) => Promise<{ success: boolean }>;
   onEditPost?: (post: any) => void;
}) => {
   const router = useRouter();
   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const [displayPosts, setDisplayPosts] = useState(posts);

   const { displayItems, isLoadingMore, endRef, hasMoreItems } = useInfiniteScroll({
      items: displayPosts,
      totalItems: totalPosts,
      itemsPerPage: 5,
   });

   useEffect(() => {
      setDisplayPosts(posts);
   }, [posts]);

   const handleDeletePost = (postId: string) => {
      setSelectedPostId(postId);
      setIsModalOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (!selectedPostId) return;

      setIsProcessing(true);
      try {
         const result = await onPostDelete?.(selectedPostId);

         if (result?.success) {
            setDisplayPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
            setIsModalOpen(false);
         }
      } catch (error: any) {
         console.error("Delete error:", error);
         toast.error(t("deleteFailed") || "Gagal menghapus postingan");
      } finally {
         setIsProcessing(false);
         setSelectedPostId(null);
      }
   };

   const handleEditPost = (postId: string) => {
      const postToEdit = displayPosts.find(p => p.id === postId);
      if (postToEdit) {
         onEditPost?.(postToEdit);
         // Scroll to top where the form is
         window.scrollTo({ top: 250, behavior: "smooth" });
      }
   };

   const handleViewPostDetail = (postId: string) => {
      router.push(`/post/${postId}`);
   };

   const getPostImageUrl = (post: any) => {
      const mediaIds = Array.isArray(post.mediaIds) ? post.mediaIds : [];
      if (mediaIds.length === 0) return undefined;
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      return `${baseUrl}/uploads/${mediaIds[0]}`;
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
         <Modal
            isOpen={isModalOpen}
            type="delete"
            title={t("confirmDelete") || "Hapus Postingan"}
            message={t("deletePostMessage") || "Anda yakin ingin menghapus postingan ini?"}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
               setIsModalOpen(false);
               setSelectedPostId(null);
            }}
            confirmText={t("delete") || "Hapus"}
            cancelText={t("cancel") || "Batal"}
            isLoading={isProcessing}
         />

         {displayItems.map((post) => (
            <PostCard
               key={post.id}
               postId={post.id}
               profileId={currentProfileId || undefined}
               author={{
                  name: profileData.name || initialUser.username,
                  avatar: profileData.profileImage ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/uploads/${profileData.profileImage}` : undefined,
                  time: formatPostTime(post.createdAt),
               }}
               content={post.content}
               image={getPostImageUrl(post)}
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
         ))}

         <div ref={endRef} className="flex justify-center py-8">
            {isLoadingMore && (
               <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            )}
            {!hasMoreItems && displayItems.length > 0 && (
               <p className="text-gray-500 text-sm">{t("noMorePosts")}</p>
            )}
         </div>
      </div>
   );
};