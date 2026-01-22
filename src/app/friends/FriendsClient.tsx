"use client";

import FriendsScreen from "@/screens/friends/FriendsScreen";
import type { FriendsClientProps } from "@/types/friend";

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