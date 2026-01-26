import { useState, useCallback } from "react";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import { UserFollow, UserSuggestion } from "@/types/profile";

const ITEMS_PER_PAGE = 10;

export const useFriendsLogic = (
  initialFollowers: UserFollow[],
  initialFollowing: UserFollow[],
  initialSuggestions: UserSuggestion[],
  currentUserId: string,
  t: (key: string) => string
) => {
   const [followers, _setFollowers] = useState<UserFollow[]>(initialFollowers);
   const [following, setFollowing] = useState<UserFollow[]>(initialFollowing);
   const [suggestions, setSuggestions] = useState<UserSuggestion[]>(initialSuggestions);
   const [searchResults, setSearchResults] = useState<UserSuggestion[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
   const [followingId, setFollowingId] = useState<string | null>(null);
   const [suggestionsOffset, setSuggestionsOffset] = useState(ITEMS_PER_PAGE);
   const [hasMoreSuggestions, setHasMoreSuggestions] = useState(
      initialSuggestions.length >= ITEMS_PER_PAGE
   );
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const performSearch = useCallback(
      async (query: string) => {
      if (!query.trim()) {
         setSearchResults([]);
         setIsSearching(false);
         return;
      }

      setIsSearching(true);
      try {
         const response = await webRequest.get("/follow", {
            params: {
            type: "search",
            search: query,
            currentUserId,
            },
         });
         setSearchResults(response.data?.data?.payload.results || []);
      } catch (error) {
         console.error("Search error:", error);
      } finally {
         setIsSearching(false);
      }
      },
      [currentUserId]
   );

   const loadMoreSuggestions = useCallback(async () => {
      if (isLoadingMore || !hasMoreSuggestions) return;

      setIsLoadingMore(true);
      try {
      const response = await webRequest.get("/follow", {
         params: {
            type: "suggestions",
            userId: currentUserId,
            limit: ITEMS_PER_PAGE,
            offset: suggestionsOffset,
         },
      });

      const newSuggestions = response.data?.data?.payload.results || [];
      if (newSuggestions.length > 0) {
         setSuggestions((prev) => [...prev, ...newSuggestions]);
         setSuggestionsOffset((prev) => prev + ITEMS_PER_PAGE);
      }
      if (newSuggestions.length < ITEMS_PER_PAGE) {
         setHasMoreSuggestions(false);
      }
      } catch (error) {
         console.error("Load more suggestions error:", error);
      } finally {
         setIsLoadingMore(false);
      }
   }, [currentUserId, suggestionsOffset, isLoadingMore, hasMoreSuggestions]);

   const handleFollow = async (
      userId: string,
      userFromSuggestion?: UserSuggestion
   ) => {
      setFollowingId(userId);
      try {
      const response = await webRequest.post("/follow", {
         type: "follow",
         followerId: currentUserId,
         followingId: userId,
      });

      if (response.data.ok) {
         const userToAdd =
            userFromSuggestion ||
            suggestions.find((s) => s.id === userId) ||
            searchResults.find((s) => s.id === userId);

         if (userToAdd) {
            const newFollowEntry: UserFollow = {
            id: response.data.data?.id || `temp-${Date.now()}`,
            followerId: currentUserId,
            followingId: userId,
            createdAt: new Date().toISOString(),
            following: {
               id: userToAdd.id,
               username: userToAdd.username,
               profile: userToAdd.profile,
            },
            };
            setFollowing((prev) => [newFollowEntry, ...prev]);
         }

         setSuggestions((prev) => prev.filter((s) => s.id !== userId));
         setSearchResults((prev) => prev.filter((s) => s.id !== userId));
         toast.success(t("followSuccess"));
      } else {
         toast.error(response.data.message || t("followFailed"));
      }
      } catch (error: any) {
         console.error("Follow error:", error);
         toast.error(error?.data?.message || t("followFailed"));
      } finally {
         setFollowingId(null);
      }
   };

   const handleUnfollow = async (followingUserId: string) => {
      setUnfollowingId(followingUserId);
      try {
      const response = await webRequest.post("/follow", {
         type: "unfollow",
         followerId: currentUserId,
         followingId: followingUserId,
      });

      if (response.data.ok) {
         const unfollowedEntry = following.find(
            (f) => f.followingId === followingUserId
         );
         if (unfollowedEntry?.following) {
            const userToSuggest: UserSuggestion = {
            id: unfollowedEntry.following.id,
            username: unfollowedEntry.following.username,
            profile: unfollowedEntry.following.profile,
            };
            setSuggestions((prev) => [userToSuggest, ...prev]);
         }

         setFollowing((prev) =>
            prev.filter((f) => f.followingId !== followingUserId)
         );
         toast.success(t("unfollowSuccess"));
      } else {
         toast.error(response.data.message || t("unfollowFailed"));
      }
      } catch (error: any) {
         console.error("Unfollow error:", error);
         toast.error(error?.data?.message || t("unfollowFailed"));
      } finally {
         setUnfollowingId(null);
      }
   };

   const filterUsers = (
      users: UserFollow[],
      query: string
   ): UserFollow[] => {
      if (!query.trim()) return users;
      return users.filter((follow) => {
      const followerInfo = follow.follower || follow.following;
      const profile = followerInfo?.profile;
      const name = profile?.name || followerInfo?.username || "";
      const username = followerInfo?.username || "";
      const lowerQuery = query.toLowerCase();

      return (
         name.toLowerCase().includes(lowerQuery) ||
         username.toLowerCase().includes(lowerQuery)
      );
      });
   };

   return {
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
   };
};
