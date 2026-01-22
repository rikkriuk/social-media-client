import type { FollowerListProps } from "@/types/friend";
import { FollowerCard } from "./FollowerCard";

export function FollowerList({
   followers,
   followingIds,
   followingLoadingId,
   onFollowBack,
   onViewProfile,
   mutualFollowText,
   followBackText,
   viewProfileText,
   emptyMessage,
}: FollowerListProps) {
   if (followers.length === 0) {
      return (
         <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
         <p className="text-gray-500">{emptyMessage}</p>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {followers.map((follow) => {
            const followerId = follow.follower?.id || follow.followerId;
            const isFollowing = followingIds.includes(followerId);
            const isLoading = followingLoadingId === followerId;

            return (
               <FollowerCard
                  key={follow.id}
                  follow={follow}
                  isFollowing={isFollowing}
                  isLoading={isLoading}
                  onFollowBack={() => onFollowBack(followerId)}
                  onViewProfile={onViewProfile}
                  mutualFollowText={mutualFollowText}
                  followBackText={followBackText}
                  viewProfileText={viewProfileText}
               />
            );
         })}
      </div>
   );
}
