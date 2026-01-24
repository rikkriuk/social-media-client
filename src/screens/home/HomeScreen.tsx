"use client";

import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { formatRelativeTime } from "@/helpers/date";
import { Post, Profile } from "@/types/profile";

import { useCreatePost } from "./hooks/useCreatePost";
import { usePostsLike } from "./hooks/usePostsLike";

import { CreatePostSection } from "./components/CreatePostSection";
import { PostsFeed } from "./components/PostsFeed";

interface HomeScreenProps {
   initialPosts: Post[];
   currentProfile: Profile | null;
   onViewPostDetail?: (post: any) => void;
}

export default function HomeScreen({
   initialPosts,
   currentProfile,
   onViewPostDetail,
}: HomeScreenProps) {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "home");
   const { t: tDate } = useTranslationCustom(lng, "date");

   const {
      posts: createPostPosts,
      postContent,
      setPostContent,
      isEventPost,
      eventDate,
      setEventDate,
      eventTime,
      setEventTime,
      eventLocation,
      setEventLocation,
      isOnlineEvent,
      setIsOnlineEvent,
      isPosting,
      handleToggleEvent,
      handleCreatePost,
   } = useCreatePost({
      initialPosts,
      currentProfile,
   });

   const { posts, handleLikeChange } = usePostsLike(createPostPosts);

   const formatPostTime = (createdAt: string) => {
      return formatRelativeTime(createdAt, tDate);
   };

   const handleCreatePostWithLike = async () => {
      await handleCreatePost();
   };

   return (
      <div className="max-w-2xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         {/* Create Post */}
         {currentProfile && (
            <CreatePostSection
               currentProfile={currentProfile}
               postContent={postContent}
               onContentChange={(content) =>
                  setPostContent({ ...postContent, content })
               }
               isEventPost={isEventPost}
               onToggleEvent={handleToggleEvent}
               eventDate={eventDate}
               onEventDateChange={setEventDate}
               eventTime={eventTime}
               onEventTimeChange={setEventTime}
               eventLocation={eventLocation}
               onEventLocationChange={setEventLocation}
               isOnlineEvent={isOnlineEvent}
               onToggleOnlineEvent={() => setIsOnlineEvent(!isOnlineEvent)}
               isPosting={isPosting}
               onCreatePost={handleCreatePostWithLike}
               tFunc={t}
            />
         )}

         {/* Posts Feed */}
         <PostsFeed
            posts={posts}
            currentProfile={currentProfile}
            formatPostTime={formatPostTime}
            onViewDetails={onViewPostDetail}
            onLikeChange={handleLikeChange}
            tFunc={t}
         />
      </div>
   );
}
