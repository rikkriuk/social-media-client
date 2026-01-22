import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabsContainerProps } from "@/types/friend";
import { FollowingList } from "./FollowingList";
import { FollowerList } from "./FollowerList";
import { SuggestionsList } from "./SuggestionsList";

export function TabsContainer({
  activeTab,
  onTabChange,
  following,
  followers,
  suggestions,
  unfollowingId,
  followingIds,
  followingLoadingId,
  hasMoreSuggestions,
  isLoadingMore,
  onUnfollow,
  onFollowBack,
  onFollow,
  onViewProfile,
  onLoadMore,
  suggestionsEndRef,
  followingTabTitle,
  followersTabTitle,
  suggestionsTabTitle,
  mutualFollowText,
  followBackText,
  viewProfileText,
  unfollowText,
  unfollowingText,
  noFollowingText,
  noFollowersText,
  noSuggestionsText,
  noMoreSuggestionsText,
  followText,
}: TabsContainerProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
        <TabsTrigger value="following" className="rounded-xl">
          {followingTabTitle} ({following.length})
        </TabsTrigger>
        <TabsTrigger value="followers" className="rounded-xl">
          {followersTabTitle} ({followers.length})
        </TabsTrigger>
        <TabsTrigger value="suggestions" className="rounded-xl">
          {suggestionsTabTitle}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="following">
        <FollowingList
          following={following}
          unfollowingId={unfollowingId}
          onUnfollow={onUnfollow}
          onViewProfile={onViewProfile}
          unfollowText={unfollowText}
          unfollowingText={unfollowingText}
          emptyMessage={noFollowingText}
        />
      </TabsContent>

      <TabsContent value="followers">
        <FollowerList
          followers={followers}
          followingIds={followingIds}
          followingLoadingId={followingLoadingId}
          onFollowBack={onFollowBack}
          onViewProfile={onViewProfile}
          mutualFollowText={mutualFollowText}
          followBackText={followBackText}
          viewProfileText={viewProfileText}
          emptyMessage={noFollowersText}
        />
      </TabsContent>

      <TabsContent value="suggestions">
        <SuggestionsList
          suggestions={suggestions}
          followingIds={followingIds}
          hasMoreSuggestions={hasMoreSuggestions}
          isLoadingMore={isLoadingMore}
          onFollow={onFollow}
          onViewProfile={onViewProfile}
          onLoadMore={onLoadMore}
          suggestionsEndRef={suggestionsEndRef}
          followText={followText}
          noMoreText={noMoreSuggestionsText}
          emptyMessage={noSuggestionsText}
        />
      </TabsContent>
    </Tabs>
  );
}
