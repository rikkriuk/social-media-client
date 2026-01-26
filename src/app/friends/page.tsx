import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FriendsClient from "./FriendsClient";
import { httpRequest } from "@/helpers/api";
import { UserFollow, UserSuggestion } from "@/types/profile";

interface FriendsPageProps {
   searchParams: Promise<{ tab?: string; userId?: string }>;
}

async function getFollowers(userId: string): Promise<UserFollow[]> {
   try {
      const response = await httpRequest.get(`/user-follows/followers`, {
         params: { userId },
      });
      return response.data?.payload.results || [];
   } catch (error) {
      console.error("Failed to fetch followers:", error);
      return [];
   }
}

async function getFollowing(userId: string): Promise<UserFollow[]> {
   try {
      const response = await httpRequest.get(`/user-follows/following`, {
         params: { userId },
      });
      return response.data?.payload.results || [];
   } catch (error) {
      console.error("Failed to fetch following:", error);
      return [];
   }
}

async function getSuggestions(userId: string): Promise<UserSuggestion[]> {
   try {
      const response = await httpRequest.get(`/user-follows/suggestions`, {
         params: { userId },
      });
      return response.data?.payload.results || [];
   } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
   }
}

const FriendsPage = async ({ searchParams }: FriendsPageProps) => {
   const cookieStore = await cookies();
   const userCookie = cookieStore.get("user");
   const { tab, userId: targetUserId } = await searchParams;

   if (!userCookie) {
      redirect("/login");
   }

   let currentUser;
   try {
      currentUser = JSON.parse(userCookie.value);
   } catch (error) {
      console.error("Failed to parse user cookie:", error);
      redirect("/login");
   }

   const userIdForData = targetUserId || currentUser.id;

   const [followers, following, suggestions] = await Promise.all([
      getFollowers(userIdForData),
      getFollowing(userIdForData),
      getSuggestions(currentUser.id),
   ]);

   const validTabs = ["following", "followers", "suggestions"];
   const initialTab = tab && validTabs.includes(tab) ? tab : "following";

   return (
      <FriendsClient
         initialFollowers={followers}
         initialFollowing={following}
         initialSuggestions={suggestions}
         currentUserId={currentUser.id}
         initialTab={initialTab}
      />
   );
};

export default FriendsPage;
