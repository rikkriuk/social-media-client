import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserFollow } from "@/types/profile";
import { FollowingList } from "./FollowingList";
import { FollowerList } from "./FollowerList";
import { SuggestionsList } from "./SuggestionsList";

interface TabsContainerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  following: UserFollow[];
  followers: UserFollow[];
  suggestions: any[];
  unfollowingId: string | null;
  followingIds: string[];
  followingLoadingId: string | null;
  hasMoreSuggestions: boolean;
  isLoadingMore: boolean;
  onUnfollow: (followingUserId: string) => void;
  onFollowBack: (followerId: string) => void;
  onFollow: (userId: string) => void;
  onViewProfile: (profileId: string) => void;
  onLoadMore: () => void;
  suggestionsEndRef: React.RefObject<HTMLDivElement | null>;
  followingTabTitle: string;
  followersTabTitle: string;
  suggestionsTabTitle: string;
  mutualFollowText: string;
  followBackText: string;
  viewProfileText: string;
  unfollowText: string;
  unfollowingText: string;
  noFollowingText: string;
  noFollowersText: string;
  noSuggestionsText: string;
  noMoreSuggestionsText: string;
  followText: string;
}

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
