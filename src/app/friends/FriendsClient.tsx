"use client";

import { useState } from "react";
import { Search, UserMinus, MoreHorizontal, MessageCircle } from "lucide-react";
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
import { UserFollow } from "@/types/profile";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";

interface FriendsClientProps {
   initialFollowers: UserFollow[];
   initialFollowing: UserFollow[];
   currentUserId: string;
}

const FriendsClient = ({
   initialFollowers,
   initialFollowing,
   currentUserId
}: FriendsClientProps) => {
   const router = useRouter();
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "friends");

   const [searchQuery, setSearchQuery] = useState("");
   const [followers, setFollowers] = useState<UserFollow[]>(initialFollowers);
   const [following, setFollowing] = useState<UserFollow[]>(initialFollowing);
   const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

   const handleUnfollow = async (followingUserId: string) => {
      setUnfollowingId(followingUserId);
      try {
         const response = await webRequest.post("/follow", {
            type: "unfollow",
            followerId: currentUserId,
            followingId: followingUserId,
         });

         if (response.data.ok) {
            setFollowing(following.filter(f => f.followingId !== followingUserId));
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

   const filteredFollowers = followers.filter((follow) => {
      const name = follow.follower?.profile?.name || follow.follower?.username || "";
      const username = follow.follower?.username || "";
      return (
         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         username.toLowerCase().includes(searchQuery.toLowerCase())
      );
   });

   const filteredFollowing = following.filter((follow) => {
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
         </div>

         <Tabs defaultValue="following" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-xl mb-6">
               <TabsTrigger value="following" className="rounded-xl">
                  {t("following")} ({following.length})
               </TabsTrigger>
               <TabsTrigger value="followers" className="rounded-xl">
                  {t("followers")} ({followers.length})
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
         </Tabs>
      </div>
   );
};

export default FriendsClient;
