"use client";

import { useState } from "react";
import { Search, UserPlus, UserCheck, UserX, MoreHorizontal, MessageCircle } from "lucide-react";
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

interface Friend {
   id: string;
   name: string;
   username: string;
   avatar?: string;
   mutualFriends: number;
   isOnline?: boolean;
}

const FriendsPage = () => {
   const [searchQuery, setSearchQuery] = useState("");

   const allFriends: Friend[] = [
      { id: "1", name: "Sarah Johnson", username: "sarahjohnson", mutualFriends: 12, isOnline: true },
      { id: "2", name: "Michael Chen", username: "michaelchen", mutualFriends: 8, isOnline: true },
      { id: "3", name: "Emma Wilson", username: "emmawilson", mutualFriends: 15, isOnline: false },
      { id: "4", name: "David Brown", username: "davidbrown", mutualFriends: 5, isOnline: false },
      { id: "5", name: "Lisa Anderson", username: "lisaanderson", mutualFriends: 20, isOnline: true },
      { id: "6", name: "James Taylor", username: "jamestaylor", mutualFriends: 3, isOnline: false },
   ];

   const friendRequests: Friend[] = [
      { id: "7", name: "Alex Martinez", username: "alexmartinez", mutualFriends: 4 },
      { id: "8", name: "Sophie Lee", username: "sophielee", mutualFriends: 7 },
      { id: "9", name: "Ryan Garcia", username: "ryangarcia", mutualFriends: 2 },
   ];

   const suggestions: Friend[] = [
      { id: "10", name: "Olivia Davis", username: "oliviadavis", mutualFriends: 6 },
      { id: "11", name: "Daniel Kim", username: "danielkim", mutualFriends: 9 },
      { id: "12", name: "Mia Thompson", username: "miathompson", mutualFriends: 11 },
      { id: "13", name: "Ethan White", username: "ethanwhite", mutualFriends: 1 },
   ];

   const filteredFriends = allFriends.filter(
      (friend) =>
         friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         friend.username.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const FriendCard = ({ friend, type }: { friend: Friend; type: "friend" | "request" | "suggestion" }) => (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="flex items-center gap-3">
            <div className="relative">
               <Avatar className="w-14 h-14">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback className="text-lg">{friend.name.charAt(0)}</AvatarFallback>
               </Avatar>
               {friend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
               )}
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-gray-900 dark:text-white truncate">{friend.name}</h3>
               <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
               <p className="text-xs text-gray-400">{friend.mutualFriends} mutual friends</p>
            </div>

            {type === "friend" && (
               <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="rounded-xl">
                     <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </Button>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="rounded-xl">
                           <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Unfriend</DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            )}

            {type === "request" && (
               <div className="flex items-center gap-2">
                  <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                     <UserCheck className="w-4 h-4 mr-1" />
                     Accept
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl">
                     <UserX className="w-4 h-4 mr-1" />
                     Decline
                  </Button>
               </div>
            )}

            {type === "suggestion" && (
               <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add Friend
               </Button>
            )}
         </div>
      </div>
   );

   return (
      <div className="max-w-4xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Friends</h1>
            <p className="text-gray-500">Connect with people you know</p>
         </div>

         {/* Search */}
         <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
               placeholder="Search friends..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
            />
         </div>

         <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
               <TabsTrigger value="all" className="rounded-xl">
                  All Friends ({allFriends.length})
               </TabsTrigger>
               <TabsTrigger value="requests" className="rounded-xl">
                  Requests ({friendRequests.length})
               </TabsTrigger>
               <TabsTrigger value="suggestions" className="rounded-xl">
                  Suggestions
               </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
               {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                     <FriendCard key={friend.id} friend={friend} type="friend" />
                  ))
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <p className="text-gray-500">No friends found</p>
                  </div>
               )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
               {friendRequests.length > 0 ? (
                  friendRequests.map((friend) => (
                     <FriendCard key={friend.id} friend={friend} type="request" />
                  ))
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <p className="text-gray-500">No pending requests</p>
                  </div>
               )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
               {suggestions.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} type="suggestion" />
               ))}
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default FriendsPage;
