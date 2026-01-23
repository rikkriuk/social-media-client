import { useState, useCallback } from "react";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import type { Post, PostContent, EventData } from "@/types/profile";

export const usePostCreation = (
   initialPosts: Post[],
   t: (key: string) => string | undefined
) => {
   const [posts, setPosts] = useState<Post[]>(initialPosts);
   const [postContent, setPostContent] = useState<PostContent>({ content: "", mediaIds: [] });
   const [isEventPost, setIsEventPost] = useState(false);
   const [eventDate, setEventDate] = useState("");
   const [eventTime, setEventTime] = useState("");
   const [eventLocation, setEventLocation] = useState("");
   const [isOnlineEvent, setIsOnlineEvent] = useState(false);
   const [isPosting, setIsPosting] = useState(false);

   const handleToggleEvent = useCallback(() => {
      setIsEventPost((prev) => !prev);
      if (isEventPost) {
         setEventDate("");
         setEventTime("");
         setEventLocation("");
         setIsOnlineEvent(false);
      }
   }, [isEventPost]);

   const handleCreatePost = useCallback(async () => {
      if (!postContent.content.trim()) return;

      setIsPosting(true);
      try {
         const postData: any = {
            content: postContent.content,
            mediaIds: postContent.mediaIds,
         };

         if (isEventPost) {
            postData.isEvent = true;
            postData.eventDate = eventDate;
            postData.eventTime = eventTime;
            postData.eventLocation = isOnlineEvent ? "Online" : eventLocation;
         }

         const response = await webRequest.post("/post", postData);

         if (response.data.ok) {
            const newPost = response.data.data;
            setPosts([newPost, ...posts]);

            // Reset form
            setPostContent({ content: "", mediaIds: [] });
            setIsEventPost(false);
            setEventDate("");
            setEventTime("");
            setEventLocation("");
            setIsOnlineEvent(false);

            toast.success(t("postCreated"));
         }
      } catch (err) {
         console.error("Error creating post:", err);
         toast.error(t("postCreateFailed"));
      } finally {
         setIsPosting(false);
      }
   }, [postContent, isEventPost, eventDate, eventTime, eventLocation, isOnlineEvent, posts, t]);

   const handleLikeChange = useCallback((postId: string, newLikeCount: number, isLiked: boolean) => {
      setPosts((prevPosts) =>
         prevPosts.map((post) =>
            post.id === postId
               ? { ...post, likesCount: newLikeCount, isLiked }
               : post
         )
      );
   }, []);

   return {
      posts,
      setPosts,
      postContent,
      setPostContent,
      isEventPost,
      setIsEventPost,
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
      handleLikeChange,
   };
};
