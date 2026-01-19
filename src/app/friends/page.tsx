import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FriendsClient from "./FriendsClient";
import { httpRequest } from "@/helpers/api";
import { UserFollow } from "@/types/profile";

async function getFollowers(userId: string): Promise<UserFollow[]> {
   try {
      const response = await httpRequest.get(`/user-follows/followers`, {
         params: { userId },
      });
      return response.data?.data || response.data || [];
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
      return response.data?.data || response.data || [];
   } catch (error) {
      console.error("Failed to fetch following:", error);
      return [];
   }
}

const FriendsPage = async () => {
   const cookieStore = await cookies();
   const userCookie = cookieStore.get("user");

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

   const [followers, following] = await Promise.all([
      getFollowers(currentUser.id),
      getFollowing(currentUser.id),
   ]);

   return (
      <FriendsClient
         initialFollowers={followers}
         initialFollowing={following}
         currentUserId={currentUser.id}
      />
   );
};

export default FriendsPage;
