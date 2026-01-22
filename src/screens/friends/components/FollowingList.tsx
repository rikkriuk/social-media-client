import { UserFollow } from "@/types/profile";
import { FollowingCard } from "./FollowingCard";

interface FollowingListProps {
  following: UserFollow[];
  unfollowingId: string | null;
  onUnfollow: (followingUserId: string) => void;
  onViewProfile: (profileId: string) => void;
  unfollowText: string;
  unfollowingText: string;
  emptyMessage: string;
}

export function FollowingList({
  following,
  unfollowingId,
  onUnfollow,
  onViewProfile,
  unfollowText,
  unfollowingText,
  emptyMessage,
}: FollowingListProps) {
  if (following.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {following.map((follow) => (
        <FollowingCard
          key={follow.id}
          follow={follow}
          isUnfollowing={unfollowingId === follow.followingId}
          onUnfollow={() => onUnfollow(follow.followingId)}
          onViewProfile={onViewProfile}
          unfollowText={unfollowText}
          unfollowingText={unfollowingText}
        />
      ))}
    </div>
  );
}
