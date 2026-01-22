"use client";

import { useState, useCallback } from "react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { useRouter } from "next/navigation";
import type { UserFollow } from "@/types/profile";
import type { FriendsScreenProps } from "@/types/friend";

import { useFriendsLogic } from "./hooks/useFriendsLogic";
import { useDebouncedSearch } from "./hooks/useDebouncedSearch";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

import { SearchSection } from "./components/SearchSection";
import { TabsContainer } from "./components/TabsContainer";

export default function FriendsScreen({
   initialFollowers,
   initialFollowing,
   initialSuggestions,
   currentUserId,
   initialTab = "following",
}: FriendsScreenProps) {
   const router = useRouter();
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "friends");

   const [searchQuery, setSearchQuery] = useState("");
   const [activeTab, setActiveTab] = useState(initialTab);

   const {
      followers,
      following,
      suggestions,
      searchResults,
      isSearching,
      unfollowingId,
      followingId,
      hasMoreSuggestions,
      isLoadingMore,
      performSearch,
      loadMoreSuggestions,
      handleFollow,
      handleUnfollow,
      filterUsers,
   } = useFriendsLogic(
      initialFollowers,
      initialFollowing,
      initialSuggestions,
      currentUserId,
      t
   );

  // Debounced search
   useDebouncedSearch({
      query: searchQuery,
      callback: performSearch,
   });

  // Infinite scroll
   const suggestionsEndRef = useInfiniteScroll({
      callback: loadMoreSuggestions,
      hasMore: hasMoreSuggestions,
      isLoading: isLoadingMore,
      isActive: activeTab === "suggestions",
   });

  // Handlers
   const handleViewProfile = useCallback(
      (profileId: string) => {
         router.push(`/profile/${profileId}`);
      },
      [router]
   );

   const handleFollowBackWithUser = useCallback(
      async (followerId: string, user?: UserFollow) => {
         await handleFollow(followerId);
      },
      [handleFollow]
   );

   const filteredFollowers = filterUsers(followers, searchQuery);
   const filteredFollowing = filterUsers(following, searchQuery);
   const followingIds = following.map((f) => f.followingId);

   return (
      <div className="max-w-4xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         {/* Header */}
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
               {t("title")}
            </h1>
            <p className="text-gray-500">{t("subtitle")}</p>
         </div>

         {/* Search Section */}
         <SearchSection
            query={searchQuery}
            isSearching={isSearching}
            results={searchResults}
            followingIds={followingIds}
            onQueryChange={setSearchQuery}
            onFollow={handleFollow}
            onViewProfile={handleViewProfile}
            searchPlaceholder={t("searchPlaceholder")}
            searchResultsTitle={t("searchResults")}
            followText={t("follow")}
         />

         {/* Tabs Container */}
         <TabsContainer
            activeTab={activeTab}
            onTabChange={setActiveTab}
            following={filteredFollowing}
            followers={filteredFollowers}
            suggestions={suggestions}
            unfollowingId={unfollowingId}
            followingIds={followingIds}
            followingLoadingId={followingId}
            hasMoreSuggestions={hasMoreSuggestions}
            isLoadingMore={isLoadingMore}
            onUnfollow={handleUnfollow}
            onFollowBack={handleFollowBackWithUser}
            onFollow={handleFollow}
            onViewProfile={handleViewProfile}
            onLoadMore={loadMoreSuggestions}
            suggestionsEndRef={suggestionsEndRef}
            followingTabTitle={t("following")}
            followersTabTitle={t("followers")}
            suggestionsTabTitle={t("suggestions")}
            mutualFollowText={t("mutualFollow")}
            followBackText={t("followBack")}
            viewProfileText={t("viewProfile")}
            unfollowText={t("unfollow")}
            unfollowingText={t("unfollowing")}
            noFollowingText={t("noFollowing")}
            noFollowersText={t("noFollowers")}
            noSuggestionsText={t("noSuggestions")}
            noMoreSuggestionsText={t("noMoreSuggestions")}
            followText={t("follow")}
         />
      </div>
   );
}
