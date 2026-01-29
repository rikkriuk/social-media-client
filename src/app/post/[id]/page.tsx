import { cookies } from "next/headers";
import PostDetailClient from "./PostDetailClient";
import { httpRequest } from "@/helpers/api";
import type { Profile, Post } from "@/types/profile";

interface PostDetailPageProps {
   params: Promise<{ id: string }>;
}

async function getPostById(postId: string) {
   try {
      const response = await httpRequest.get(`/posts/${postId}`);
      return response.data || null;
   } catch (error) {
      console.error("Failed to fetch post:", error);
      return null;
   }
}

async function getComments(postId: string) {
   try {
      const response = await httpRequest.get(`/comments/post/${postId}`, {
         params: { limit: 20, offset: 0 },
      });
      return response.data?.data || [];
   } catch (error) {
      console.error("Failed to fetch comments:", error);
      return [];
   }
}

async function checkLikeStatus(postId: string, profileId: string) {
   try {
      const response = await httpRequest.get(`/likes/check`, {
         params: { postId, profileId },
      });
      return response.data?.isLiked || false;
   } catch {
      return false;
   }
}

const PostDetailPage = async ({ params }: PostDetailPageProps) => {
   const { id: postId } = await params;

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

   const post = await getPostById(postId);

   if (!post) {
      return (
         <div className="max-w-2xl mx-auto p-8 text-center">
            <p className="text-gray-500">Post not found</p>
         </div>
      );
   }

   const [comments, isLiked] = await Promise.all([
      getComments(postId),
      currentProfile?.id ? checkLikeStatus(postId, currentProfile.id) : Promise.resolve(false),
   ]);

   return (
      <PostDetailClient
         post={{ ...post, isLiked }}
         comments={comments}
         currentProfileId={currentProfile?.id || null}
      />
   );
};

export default PostDetailPage;
