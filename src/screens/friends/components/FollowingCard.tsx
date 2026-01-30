import type { FollowingCardProps } from "@/types/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserMinus } from "lucide-react";

export function FollowingCard({
  follow,
  isUnfollowing,
  onUnfollow,
  onViewProfile,
  unfollowText,
  unfollowingText,
}: FollowingCardProps) {
  const user = follow.following;
  const profile = user?.profile;
  const name = profile?.name || user?.username || "Unknown";
  const username = user?.username || "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const profileImageUrl = profile?.profileImage ? `${baseUrl}/uploads/${profile.profileImage}` : undefined;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Avatar
          className="w-14 h-14 cursor-pointer"
          onClick={() => profile?.id && onViewProfile(profile.id)}
        >
          <AvatarImage src={profileImageUrl} />
          <AvatarFallback className="text-lg">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:underline"
            onClick={() => profile?.id && onViewProfile(profile.id)}
          >
            {name}
          </h3>
          <p className="text-sm text-gray-500 truncate">@{username}</p>
          {profile?.bio && (
            <p className="text-xs text-gray-400 truncate">{profile.bio}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-xl">
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onUnfollow}
            disabled={isUnfollowing}
          >
            <UserMinus className="w-4 h-4 mr-1" />
            {isUnfollowing ? unfollowingText : unfollowText}
          </Button>
        </div>
      </div>
    </div>
  );
}
