import { PostCard } from "@/components/PostCard";
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
   if (posts.length === 0) {
      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">{t("noPostsYet")}</p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {posts.map((post) => (
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
            />
         ))}
      </div>
   );
};
