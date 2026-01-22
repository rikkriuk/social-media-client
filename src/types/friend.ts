import type { UserFollow, UserSuggestion } from "./profile";

// Screen Props
export interface FriendsScreenProps {
   initialFollowers: UserFollow[];
   initialFollowing: UserFollow[];
   initialSuggestions: UserSuggestion[];
   currentUserId: string;
   initialTab?: string;
}

export interface FriendsClientProps {
   initialFollowers: UserFollow[];
   initialFollowing: UserFollow[];
   initialSuggestions: UserSuggestion[];
   currentUserId: string;
   initialTab?: string;
}

// Component Props
export interface FollowerCardProps {
   follow: UserFollow;
   isFollowing: boolean;
   isLoading: boolean;
   onFollowBack: () => void;
   onViewProfile: (profileId: string) => void;
   mutualFollowText: string;
   followBackText: string;
   viewProfileText: string;
}

export interface FollowerListProps {
   followers: UserFollow[];
   followingIds: string[];
   followingLoadingId: string | null;
   onFollowBack: (followerId: string) => void;
   onViewProfile: (profileId: string) => void;
   mutualFollowText: string;
   followBackText: string;
   viewProfileText: string;
   emptyMessage: string;
}

export interface FollowingCardProps {
   follow: UserFollow;
   isUnfollowing: boolean;
   onUnfollow: () => void;
   onViewProfile: (profileId: string) => void;
   unfollowText: string;
   unfollowingText: string;
}

export interface FollowingListProps {
   following: UserFollow[];
   unfollowingId: string | null;
   onUnfollow: (followingUserId: string) => void;
   onViewProfile: (profileId: string) => void;
   unfollowText: string;
   unfollowingText: string;
   emptyMessage: string;
}

export interface SuggestionCardProps {
   user: UserSuggestion;
   isLoading: boolean;
   onFollow: () => void;
   onViewProfile: (profileId: string) => void;
   followText: string;
}

export interface SuggestionsListProps {
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

export interface SearchSectionProps {
   query: string;
   isSearching: boolean;
   results: UserSuggestion[];
   followingIds: string[];
   onQueryChange: (query: string) => void;
   onFollow: (userId: string) => void;
   onViewProfile: (profileId: string) => void;
   searchPlaceholder: string;
   searchResultsTitle: string;
   followText: string;
}

export interface TabsContainerProps {
   activeTab: string;
   onTabChange: (tab: string) => void;
   following: UserFollow[];
   followers: UserFollow[];
   suggestions: UserSuggestion[];
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

// Hook Props
export interface UseInfiniteScrollProps {
   callback: () => void;
   hasMore: boolean;
   isLoading: boolean;
   isActive: boolean;
}

export interface UseDebouncedSearchProps {
   query: string;
   callback: (query: string) => void;
   delay?: number;
}
