"use client";

import FriendsScreen from "@/screens/friends/FriendsScreen";
import { UserFollow, UserSuggestion } from "@/types/profile";

interface FriendsClientProps {
  initialFollowers: UserFollow[];
  initialFollowing: UserFollow[];
  initialSuggestions: UserSuggestion[];
  currentUserId: string;
  initialTab?: string;
}

export default function FriendsClient({
   initialFollowers,
   initialFollowing,
   initialSuggestions,
   currentUserId,
   initialTab = "following",
}: FriendsClientProps) {
   return (
      <FriendsScreen
         initialFollowers={initialFollowers}
         initialFollowing={initialFollowing}
         initialSuggestions={initialSuggestions}
         currentUserId={currentUserId}
         initialTab={initialTab}
      />
   );
}