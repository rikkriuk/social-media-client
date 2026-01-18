import { cookies } from "next/headers";
import HomeClient from "./HomeClient";
import { httpRequest } from "@/helpers/api";
import { Post, Profile } from "@/types/profile";

async function getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
   try {
      const response = await httpRequest.get(`/posts?limit=${limit}&offset=${offset}`);
      return response.data?.posts || response.data || [];
   } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
   }
}

const HomePage = async () => {
   const cookieStore = await cookies();
   const profileCookie = cookieStore.get("profile");

   let currentProfile: Profile | null = null;

   if (profileCookie) {
      try {
         currentProfile = JSON.parse(profileCookie.value);
      } catch (error) {
         console.error("Failed to parse profile cookie:", error);
      }
   }

   const posts = await getPosts();

   return (
      <HomeClient
         initialPosts={posts}
         currentProfile={currentProfile}
      />
   );
};

export default HomePage;
