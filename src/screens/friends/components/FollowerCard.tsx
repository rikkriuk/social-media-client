import type { FollowerCardProps } from "@/types/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Loader2 } from "lucide-react";

export function FollowerCard({
   follow,
   isFollowing,
   isLoading,
   onFollowBack,
   onViewProfile,
   mutualFollowText,
   followBackText,
   viewProfileText,
}: FollowerCardProps) {
   const user = follow.follower;
   const profile = user?.profile;
   const name = profile?.name || user?.username || "Unknown";
   const username = user?.username || "";
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
   const profileImageUrl = profile?.profileImage ? `${baseUrl}/uploads/${profile.profileImage}` : undefined;

   return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="flex items-center gap-3">
            <Avatar
               className="w-14 h-14 cursor-pointer"
               onClick={() => profile?.id && onViewProfile(profile.id)}
            >
               <AvatarImage src={profileImageUrl} />
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

            <div className="flex items-center gap-2">
               {!isFollowing ? (
               <Button
                  size="sm"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onFollowBack}
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                     <UserPlus className="w-4 h-4 mr-1" />
                  )}
                  {followBackText}
               </Button>
               ) : (
               <span className="text-xs text-gray-400 px-2">{mutualFollowText}</span>
               )}

               <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-xl">
                     <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem
                     onClick={() => profile?.id && onViewProfile(profile.id)}
                  >
                     {viewProfileText}
                  </DropdownMenuItem>
               </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </div>
   );
}
