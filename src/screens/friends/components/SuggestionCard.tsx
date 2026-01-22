import { UserSuggestion } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";

interface SuggestionCardProps {
  user: UserSuggestion;
  isLoading: boolean;
  onFollow: () => void;
  onViewProfile: (profileId: string) => void;
  followText: string;
}

export function SuggestionCard({
  user,
  isLoading,
  onFollow,
  onViewProfile,
  followText,
}: SuggestionCardProps) {
  const profile = user.profile;
  const name = profile?.name || user.username || "Unknown";
  const username = user.username || "";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Avatar
          className="w-14 h-14 cursor-pointer"
          onClick={() => profile?.id && onViewProfile(profile.id)}
        >
          <AvatarImage src={undefined} />
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

        <Button
          size="sm"
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onFollow}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-1" />
          )}
          {followText}
        </Button>
      </div>
    </div>
  );
}
