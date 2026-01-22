import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SearchSectionProps } from "@/types/friend";
import { SuggestionCard } from "./SuggestionCard";

export function SearchSection({
  query,
  isSearching,
  results,
  followingIds,
  onQueryChange,
  onFollow,
  onViewProfile,
  searchPlaceholder,
  searchResultsTitle,
  followText,
}: SearchSectionProps) {
  return (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      {query.trim() && results.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {searchResultsTitle}
          </h2>
          <div className="space-y-4">
            {results.map((user) => (
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
        </div>
      )}
    </>
  );
}
