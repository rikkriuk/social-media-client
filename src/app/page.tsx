import { cookies } from "next/headers";
import HomeClient from "./HomeClient";
import { httpRequest } from "@/helpers/api";
import { Post, Profile } from "@/types/profile";

async function getPosts(limit: number = 10, offset: number = 0, currentProfileId?: string | null): Promise<Post[]> {
   try {
      const response = await httpRequest.get(`/posts?limit=${limit}&offset=${offset}`);
      const posts = response.data?.posts || response.data || [];

      if (currentProfileId && posts.length > 0) {
         const likeStatusPromises = posts.map(async (post: Post) => {
            try {
               const likeResponse = await httpRequest.get(`/likes/check`, {
                  params: { postId: post.id, profileId: currentProfileId }
               });
               return { postId: post.id, isLiked: likeResponse.data?.isLiked || false };
            } catch {
               return { postId: post.id, isLiked: false };
            }
         });

         const likeStatuses = await Promise.all(likeStatusPromises);
         const likeStatusMap = new Map(likeStatuses.map(s => [s.postId, s.isLiked]));

         return posts.map((post: Post) => ({
            ...post,
            isLiked: likeStatusMap.get(post.id) || false
         }));
      }

      return posts;
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

   const posts = await getPosts(10, 0, currentProfile?.id);

   return (
      <HomeClient
         initialPosts={posts}
         currentProfile={currentProfile}
      />
   );
};

export default HomePage;
