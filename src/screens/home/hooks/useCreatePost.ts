import { useState } from "react";
import { Post, Profile } from "@/types/profile";
import { webRequest } from "@/helpers/api";

interface UseCreatePostProps {
  initialPosts: Post[];
  currentProfile: Profile | null;
}

export const useCreatePost = ({ initialPosts, currentProfile }: UseCreatePostProps) => {
   const [posts, setPosts] = useState<Post[]>(initialPosts);
   const [postContent, setPostContent] = useState({
      content: "",
      mediaIds: [] as string[],
   });
   const [isEventPost, setIsEventPost] = useState(false);
   const [eventDate, setEventDate] = useState("");
   const [eventTime, setEventTime] = useState("");
   const [eventLocation, setEventLocation] = useState("");
   const [isOnlineEvent, setIsOnlineEvent] = useState(false);
   const [isPosting, setIsPosting] = useState(false);

   const handleToggleEvent = () => {
      setIsEventPost(!isEventPost);
      if (isEventPost) {
         setEventDate("");
         setEventTime("");
         setEventLocation("");
         setIsOnlineEvent(false);
      }
   };

   const handleCreatePost = async () => {
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

            setPostContent({ content: "", mediaIds: [] });
            setIsEventPost(false);
            setEventDate("");
            setEventTime("");
            setEventLocation("");
            setIsOnlineEvent(false);
         }
      } catch (err) {
         console.error("Error creating post:", err);
      } finally {
         setIsPosting(false);
      }
   };

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
   };
};
