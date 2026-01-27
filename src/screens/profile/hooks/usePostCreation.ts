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
   const [editingPostId, setEditingPostId] = useState<string | null>(null);

   const handleToggleEvent = useCallback(() => {
      setIsEventPost((prev) => !prev);
      if (isEventPost) {
         setEventDate("");
         setEventTime("");
         setEventLocation("");
         setIsOnlineEvent(false);
      }
   }, [isEventPost]);

   const handleEditPost = useCallback((post: Post) => {
      setEditingPostId(post.id);
      setPostContent({ content: post.content, mediaIds: post.mediaIds || [] });
      setIsEventPost(post.isEvent || false);
      setEventDate(post.eventDate || "");
      setEventTime(post.eventTime || "");
      setEventLocation(post.eventLocation || "");
      setIsOnlineEvent(post.eventLocation === "Online");
   }, []);

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

         if (editingPostId) {
            // Edit mode
            const response = await webRequest.patch(`/post/${editingPostId}`, postData);

            if (response.data.ok) {
               const updatedPost = response.data.data;
               setPosts((prevPosts) =>
                  prevPosts.map((post) =>
                     post.id === editingPostId ? updatedPost : post
                  )
               );

               // Reset form
               setPostContent({ content: "", mediaIds: [] });
               setIsEventPost(false);
               setEventDate("");
               setEventTime("");
               setEventLocation("");
               setIsOnlineEvent(false);
               setEditingPostId(null);

               toast.success(t("postUpdated") || "Postingan berhasil diperbarui");
            }
         } else {
            // Create mode
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
         }
      } catch (err) {
         console.error("Error creating/updating post:", err);
         toast.error(editingPostId ? t("postUpdateFailed") : t("postCreateFailed"));
      } finally {
         setIsPosting(false);
      }
   }, [postContent, isEventPost, eventDate, eventTime, eventLocation, isOnlineEvent, posts, editingPostId, t]);

   const handleCancelEdit = useCallback(() => {
      setEditingPostId(null);
      setPostContent({ content: "", mediaIds: [] });
      setIsEventPost(false);
      setEventDate("");
      setEventTime("");
      setEventLocation("");
      setIsOnlineEvent(false);
   }, []);

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
      editingPostId,
      handleToggleEvent,
      handleCreatePost,
      handleLikeChange,
      handleEditPost,
      handleCancelEdit,
   };
};
