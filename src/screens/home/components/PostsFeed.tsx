import { PostCard } from "@/components/PostCard";
import { useSharePost } from "@/hooks/useSharePost";
import { PostsFeedProps } from "@/types/home";

export const PostsFeed = ({
   posts,
   currentProfile,
   formatPostTime,
   onViewDetails,
   onLikeChange,
   tFunc,
}: PostsFeedProps) => {
   const { sharePost } = useSharePost(tFunc);

   return (
      <div className="space-y-6">
         {posts.length > 0 ? (
            posts.map((post) => (
               <PostCard
                  key={post.id}
                  postId={post.id}
                  profileId={currentProfile?.id}
                  author={{
                  name: post.profile?.name || "Unknown",
                  avatar: undefined,
                  time: formatPostTime(post.createdAt),
                  }}
                  content={post.content}
                  image={post.image}
                  images={
                     Array.isArray(post.mediaIds) && post.mediaIds.length > 0
                        ? post.mediaIds.map((id: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/uploads/${id}`)
                        : undefined
                  }
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  shares={post.sharesCount}
                  initialIsLiked={post.isLiked}
                  onViewDetails={() => onViewDetails?.(post)}
                  onLikeChange={onLikeChange}
                  onShare={() => sharePost(post.id)}
               />
            ))
            ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
               <p className="text-gray-500">{tFunc("noPosts")}</p>
            </div>
         )}
      </div>
   );
};
