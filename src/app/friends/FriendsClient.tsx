"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, UserMinus, UserPlus, MoreHorizontal, MessageCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserFollow, UserSuggestion } from "@/types/profile";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";

interface FriendsClientProps {
   initialFollowers: UserFollow[];
   initialFollowing: UserFollow[];
   initialSuggestions: UserSuggestion[];
   currentUserId: string;
   initialTab?: string;
}

const ITEMS_PER_PAGE = 10;

const FriendsClient = ({
   initialFollowers,
   initialFollowing,
   initialSuggestions,
   currentUserId,
   initialTab = "following"
}: FriendsClientProps) => {
   const router = useRouter();
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "friends");

   const [searchQuery, setSearchQuery] = useState("");
   const [followers, _setFollowers] = useState<UserFollow[]>(initialFollowers);
   const [following, setFollowing] = useState<UserFollow[]>(initialFollowing);
   const [suggestions, setSuggestions] = useState<UserSuggestion[]>(initialSuggestions);
   const [searchResults, setSearchResults] = useState<UserSuggestion[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
   const [followingId, setFollowingId] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState(initialTab);

   const [suggestionsOffset, setSuggestionsOffset] = useState(ITEMS_PER_PAGE);
   const [hasMoreSuggestions, setHasMoreSuggestions] = useState(initialSuggestions.length >= ITEMS_PER_PAGE);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const suggestionsEndRef = useRef<HTMLDivElement>(null);

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

         const newSuggestions = response.data?.data?.rows || [];
         if (newSuggestions.length > 0) {
            setSuggestions(prev => [...prev, ...newSuggestions]);
            setSuggestionsOffset(prev => prev + ITEMS_PER_PAGE);
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

   useEffect(() => {
      if (activeTab !== "suggestions") return;

      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting && hasMoreSuggestions && !isLoadingMore) {
               loadMoreSuggestions();
            }
         },
         { threshold: 0.1 }
      );

      if (suggestionsEndRef.current) {
         observer.observe(suggestionsEndRef.current);
      }

      return () => observer.disconnect();
   }, [activeTab, hasMoreSuggestions, isLoadingMore, loadMoreSuggestions]);

   // Debounced search
   useEffect(() => {
      if (!searchQuery.trim()) {
         setSearchResults([]);
         setIsSearching(false);
         return;
      }

      const timer = setTimeout(async () => {
         setIsSearching(true);
         try {
            const response = await webRequest.get("/follow", {
               params: {
                  type: "search",
                  search: searchQuery,
                  currentUserId,
               },
            });
            console.log("Search response:", response.data);
            setSearchResults(response.data?.data?.rows || []);
         } catch (error) {
            console.error("Search error:", error);
         } finally {
            setIsSearching(false);
         }
      }, 300);

      return () => clearTimeout(timer);
   }, [searchQuery, currentUserId]);

   const handleFollow = async (userId: string, userFromSuggestion?: UserSuggestion) => {
      setFollowingId(userId);
      try {
         const response = await webRequest.post("/follow", {
            type: "follow",
            followerId: currentUserId,
            followingId: userId,
         });

         if (response.data.ok) {
            const userToAdd = userFromSuggestion ||
               suggestions.find(s => s.id === userId) ||
               searchResults.find(s => s.id === userId);

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
               setFollowing(prev => [newFollowEntry, ...prev]);
            }

            // Remove from suggestions and search results
            setSuggestions(prev => prev.filter(s => s.id !== userId));
            setSearchResults(prev => prev.filter(s => s.id !== userId));
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
            const unfollowedEntry = following.find(f => f.followingId === followingUserId);
            if (unfollowedEntry?.following) {
               const userToSuggest: UserSuggestion = {
                  id: unfollowedEntry.following.id,
                  username: unfollowedEntry.following.username,
                  profile: unfollowedEntry.following.profile,
               };
               setSuggestions(prev => [userToSuggest, ...prev]);
            }

            setFollowing(prev => prev.filter(f => f.followingId !== followingUserId));
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

   const handleViewProfile = (profileId: string) => {
      router.push(`/profile/${profileId}`);
   };

   const filteredFollowers = (followers || []).filter((follow) => {
      if (!searchQuery.trim()) return true;
      const name = follow.follower?.profile?.name || follow.follower?.username || "";
      const username = follow.follower?.username || "";
      return (
         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         username.toLowerCase().includes(searchQuery.toLowerCase())
      );
   });

   const filteredFollowing = following.filter((follow) => {
      if (!searchQuery.trim()) return true;
      const name = follow.following?.profile?.name || follow.following?.username || "";
      const username = follow.following?.username || "";
      return (
         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         username.toLowerCase().includes(searchQuery.toLowerCase())
      );
   });

   const FollowerCard = ({ follow }: { follow: UserFollow }) => {
      const user = follow.follower;
      const profile = user?.profile;
      const name = profile?.name || user?.username || "Unknown";
      const username = user?.username || "";
      const followerId = user?.id || follow.followerId;

      const isAlreadyFollowing = following.some(f => f.followingId === followerId);
      const isFollowingUser = followingId === followerId;

      const handleFollowBack = async () => {
         if (!followerId) return;
         setFollowingId(followerId);
         try {
            const response = await webRequest.post("/follow", {
               type: "follow",
               followerId: currentUserId,
               followingId: followerId,
            });

            if (response.data.ok) {
               const newFollowEntry: UserFollow = {
                  id: response.data.data?.id || `temp-${Date.now()}`,
                  followerId: currentUserId,
                  followingId: followerId,
                  createdAt: new Date().toISOString(),
                  following: {
                     id: followerId,
                     username: user?.username || "",
                     profile: user?.profile,
                  },
               };
               setFollowing(prev => [newFollowEntry, ...prev]);
               toast.success(t("followSuccess"));
            } else {
               toast.error(response.data.message || t("followFailed"));
            }
         } catch (error: any) {
            console.error("Follow back error:", error);
            toast.error(error?.data?.message || t("followFailed"));
         } finally {
            setFollowingId(null);
         }
      };

      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
               <Avatar className="w-14 h-14 cursor-pointer" onClick={() => profile?.id && handleViewProfile(profile.id)}>
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <h3
                     className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:underline"
                     onClick={() => profile?.id && handleViewProfile(profile.id)}
                  >
                     {name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">@{username}</p>
                  {profile?.bio && (
                     <p className="text-xs text-gray-400 truncate">{profile.bio}</p>
                  )}
               </div>
               <div className="flex items-center gap-2">
                  {!isAlreadyFollowing ? (
                     <Button
                        size="sm"
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleFollowBack}
                        disabled={isFollowingUser}
                     >
                        {isFollowingUser ? (
                           <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                           <UserPlus className="w-4 h-4 mr-1" />
                        )}
                        {t("followBack")}
                     </Button>
                  ) : (
                     <span className="text-xs text-gray-400 px-2">{t("mutualFollow")}</span>
                  )}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="rounded-xl">
                           <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => profile?.id && handleViewProfile(profile.id)}>
                           {t("viewProfile")}
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         </div>
      );
   };

   const FollowingCard = ({ follow }: { follow: UserFollow }) => {
      const user = follow.following;
      const profile = user?.profile;
      const name = profile?.name || user?.username || "Unknown";
      const username = user?.username || "";
      const isUnfollowing = unfollowingId === follow.followingId;

      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
               <Avatar className="w-14 h-14 cursor-pointer" onClick={() => profile?.id && handleViewProfile(profile.id)}>
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <h3
                     className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:underline"
                     onClick={() => profile?.id && handleViewProfile(profile.id)}
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
                     onClick={() => handleUnfollow(follow.followingId)}
                     disabled={isUnfollowing}
                  >
                     <UserMinus className="w-4 h-4 mr-1" />
                     {isUnfollowing ? t("unfollowing") : t("unfollow")}
                  </Button>
               </div>
            </div>
         </div>
      );
   };

   const SuggestionCard = ({ user }: { user: UserSuggestion }) => {
      const profile = user.profile;
      const name = profile?.name || user.username || "Unknown";
      const username = user.username || "";
      const isFollowingUser = followingId === user.id;

      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
               <Avatar className="w-14 h-14 cursor-pointer" onClick={() => profile?.id && handleViewProfile(profile.id)}>
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <h3
                     className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:underline"
                     onClick={() => profile?.id && handleViewProfile(profile.id)}
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
                  onClick={() => handleFollow(user.id)}
                  disabled={isFollowingUser}
               >
                  {isFollowingUser ? (
                     <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                     <UserPlus className="w-4 h-4 mr-1" />
                  )}
                  {t("follow")}
               </Button>
            </div>
         </div>
      );
   };

   return (
      <div className="max-w-4xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("title")}</h1>
            <p className="text-gray-500">{t("subtitle")}</p>
         </div>

         {/* Search */}
         <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
               placeholder={t("searchPlaceholder")}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
            />
            {isSearching && (
               <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
         </div>

         {searchQuery.trim() && searchResults.length > 0 && (
            <div className="mb-6">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("searchResults")}</h2>
               <div className="space-y-4">
                  {searchResults.map((user) => (
                     <SuggestionCard key={user.id} user={user} />
                  ))}
               </div>
            </div>
         )}

         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
               <TabsTrigger value="following" className="rounded-xl">
                  {t("following")} ({following.length})
               </TabsTrigger>
               <TabsTrigger value="followers" className="rounded-xl">
                  {t("followers")} ({followers.length})
               </TabsTrigger>
               <TabsTrigger value="suggestions" className="rounded-xl">
                  {t("suggestions")}
               </TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="space-y-4">
               {filteredFollowing.length > 0 ? (
                  filteredFollowing.map((follow) => (
                     <FollowingCard key={follow.id} follow={follow} />
                  ))
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <p className="text-gray-500">{t("noFollowing")}</p>
                  </div>
               )}
            </TabsContent>

            <TabsContent value="followers" className="space-y-4">
               {filteredFollowers.length > 0 ? (
                  filteredFollowers.map((follow) => (
                     <FollowerCard key={follow.id} follow={follow} />
                  ))
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <p className="text-gray-500">{t("noFollowers")}</p>
                  </div>
               )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
               {suggestions.length > 0 ? (
                  <>
                     {suggestions.map((user) => (
                        <SuggestionCard key={user.id} user={user} />
                     ))}
                     
                     {/* Infinite scroll trigger */}
                     <div ref={suggestionsEndRef} className="py-4">
                        {isLoadingMore && (
                           <div className="flex justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                           </div>
                        )}
                        {!hasMoreSuggestions && suggestions.length >= ITEMS_PER_PAGE && (
                           <p className="text-center text-sm text-gray-400">{t("noMoreSuggestions")}</p>
                        )}
                     </div>
                  </>
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <p className="text-gray-500">{t("noSuggestions")}</p>
                  </div>
               )}
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default FriendsClient;
