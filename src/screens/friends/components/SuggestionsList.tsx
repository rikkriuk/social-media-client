import { UserSuggestion } from "@/types/profile";
import { SuggestionCard } from "./SuggestionCard";
import { Loader2 } from "lucide-react";

interface SuggestionsListProps {
  suggestions: UserSuggestion[];
  followingIds: string[];
  hasMoreSuggestions: boolean;
  isLoadingMore: boolean;
  onFollow: (userId: string) => void;
  onViewProfile: (profileId: string) => void;
  onLoadMore: () => void;
  suggestionsEndRef: React.RefObject<HTMLDivElement | null>;
  followText: string;
  noMoreText: string;
  emptyMessage: string;
}

export function SuggestionsList({
  suggestions,
  followingIds,
  hasMoreSuggestions,
  isLoadingMore,
  onFollow,
  onViewProfile,
  onLoadMore,
  suggestionsEndRef,
  followText,
  noMoreText,
  emptyMessage,
}: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {suggestions.map((user) => (
          <SuggestionCard
            key={user.id}
            user={user}
            isLoading={followingIds.includes(user.id)}
            onFollow={() => onFollow(user.id)}
            onViewProfile={onViewProfile}
            followText={followText}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={suggestionsEndRef} className="py-4">
        {isLoadingMore && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}
        {!hasMoreSuggestions && suggestions.length >= 10 && (
          <p className="text-center text-sm text-gray-400">{noMoreText}</p>
        )}
      </div>
    </>
  );
}
