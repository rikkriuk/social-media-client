import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "../ProfileClient";
import { httpRequest } from "@/helpers/api";
import { Profile, FollowCount, Post } from "@/types/profile";

interface ProfilePageProps {
   params: Promise<{ id: string }>;
   searchParams: Promise<{ page?: string }>;
}

async function getProfileById(profileId: string): Promise<Profile | null> {
   try {
      const response = await httpRequest.get(`/profiles/${profileId}`);
      console.log("Fetched profile:", response.data);
      return response.data.payload || null;
   } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
   }
}

async function getUserById(userId: string): Promise<any | null> {
   try {
      const response = await httpRequest.get(`/users/${userId}`);
      return response.data.payload || null;
   } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
   }
}

async function getFollowCount(userId: string): Promise<FollowCount> {
   try {
      const response = await httpRequest.get(`/user-follows/count/${userId}`);
      // Backend returns { data: { followers, following } }
      return response.data?.data || response.data || { followers: 0, following: 0 };
   } catch (error) {
      console.error("Failed to fetch follow count:", error);
      return { followers: 0, following: 0 };
   }
}

const ITEMS_PER_PAGE = 5;

async function getUserPosts(profileId: string, page: number = 1, currentProfileId?: string | null): Promise<{ total: number; posts: Post[] }> {
   try {
      const limit = page * ITEMS_PER_PAGE;
      const response = await httpRequest.get(`/posts/user/${profileId}?limit=${limit}`);
      const posts = response.data?.payload?.results || response.data?.data || [];
      const totalCount = response.data?.payload?.count || 0;

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

         const postsWithLikeStatus = posts.map((post: Post) => ({
            ...post,
            isLiked: likeStatusMap.get(post.id) || false
         }));

         return {
            total: totalCount,
            posts: postsWithLikeStatus,
         }
      }

      return {
         total: totalCount,
         posts,
      };
   } catch (error) {
      console.error("Failed to fetch user posts:", error);
      return { total: 0, posts: [] };
   }
}

async function checkIsFollowing(followerId: string, followingId: string): Promise<boolean> {
   try {
      const response = await httpRequest.get(`/user-follows/check`, {
         params: { followerId, followingId }
      });
      return response.data?.isFollowing || false;
   } catch (error) {
      console.error("Failed to check follow status:", error);
      return false;
   }
}

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
   const { id: profileId } = await params;
   const { page: pageParam } = await searchParams;
   const page = parseInt(pageParam || "1", 10);
   
   const cookieStore = await cookies();
   const userCookie = cookieStore.get("user");
   const profileCookie = cookieStore.get("profile");

   let currentUser = null;
   let currentProfile: Profile | null = null;

   if (userCookie && profileCookie) {
      try {
         currentUser = JSON.parse(userCookie.value);
         currentProfile = JSON.parse(profileCookie.value);
      } catch (error) {
         console.error("Failed to parse user/profile cookie:", error);
      }
   }

   const viewedProfile = await getProfileById(profileId);

   if (!viewedProfile) {
      redirect("/404");
   }

   const viewedUser = viewedProfile.userId ? await getUserById(viewedProfile.userId) : null;
   const isOwnProfile = currentProfile?.id === profileId;
   const targetUserId = viewedProfile.userId;

   const [followCount, postData] = await Promise.all([
      targetUserId ? getFollowCount(targetUserId) : Promise.resolve({ followers: 0, following: 0 }),
      getUserPosts(profileId, page, currentProfile?.id),
   ]);

   let isFollowing = false;
   let isFollowingMe = false;
   if (!isOwnProfile && currentUser?.id && targetUserId) {
      const [followingStatus, followingMeStatus] = await Promise.all([
         checkIsFollowing(currentUser.id, targetUserId),
         checkIsFollowing(targetUserId, currentUser.id),
      ]);
      isFollowing = followingStatus;
      isFollowingMe = followingMeStatus;
   }

   return (
      <ProfileClient
         initialProfile={viewedProfile}
         initialUser={{
            id: viewedUser?.id || "",
            username: viewedUser?.username || "",
            createdAt: viewedUser?.createdAt || "",
         }}
         initialFollowCount={followCount}
         initialPosts={postData.posts}
         initialTotalPosts={postData.total}
         isOwnProfile={isOwnProfile}
         isFollowing={isFollowing}
         isFollowingMe={isFollowingMe}
         currentUserId={currentUser?.id || null}
         currentProfileId={currentProfile?.id || null}
      />
   );
};

export default ProfilePage;
