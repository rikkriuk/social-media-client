"use client";

import { useState } from "react";
import { ImagePlus, Video, Smile, Calendar, X } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { Textarea } from "@/components/ui/textarea";
import { webRequest } from "@/helpers/api";
import { Post, Profile } from "@/types/profile";
import { formatRelativeTime } from "@/helpers/date";

interface HomeClientProps {
   initialPosts: Post[];
   currentProfile: Profile | null;
   onViewPostDetail?: (post: any) => void;
}

const HomeClient = ({ initialPosts, currentProfile, onViewPostDetail }: HomeClientProps) => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "home");
   const { t: tDate } = useTranslationCustom(lng, "date");

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

   const formatPostTime = (createdAt: string) => {
      return formatRelativeTime(createdAt, tDate);
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
            // Add new post to the top of the list
            const newPost = response.data.data;
            setPosts([newPost, ...posts]);

            // Reset form
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

   const getAvatarInitial = () => {
      if (currentProfile?.name) {
         return currentProfile.name.charAt(0).toUpperCase();
      }
      return "U";
   };

   return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6">
         {/* Create Post */}
         {currentProfile && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
               <div className="flex items-start gap-3">
                  <Avatar>
                     <AvatarFallback>{getAvatarInitial()}</AvatarFallback>
                  </Avatar>
                  <Textarea
                     placeholder={t("whatsOnYourMind")}
                     value={postContent.content}
                     onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
                     className="flex-1 resize-none border-0 focus-visible:ring-0 bg-gray-100 dark:bg-gray-800 rounded-xl"
                     rows={2}
                  />
               </div>

               {/* Event Details Section */}
               {isEventPost && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                     <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                           <Calendar className="w-4 h-4" />
                           {t("eventDetails")}
                        </span>
                        <button
                           onClick={handleToggleEvent}
                           className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                           <X className="w-4 h-4" />
                        </button>
                     </div>
                     <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t("date")}</label>
                              <Input
                                 type="date"
                                 value={eventDate}
                                 onChange={(e) => setEventDate(e.target.value)}
                                 className="rounded-lg text-sm"
                              />
                           </div>
                           <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t("time")}</label>
                              <Input
                                 type="time"
                                 value={eventTime}
                                 onChange={(e) => setEventTime(e.target.value)}
                                 className="rounded-lg text-sm"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="text-xs text-gray-500 mb-1 block">{t("location")}</label>
                           <div className="flex gap-2">
                              <Input
                                 placeholder={t("enterLocation")}
                                 value={eventLocation}
                                 onChange={(e) => setEventLocation(e.target.value)}
                                 disabled={isOnlineEvent}
                                 className="rounded-lg text-sm flex-1"
                              />
                              <Button
                                 type="button"
                                 variant={isOnlineEvent ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => setIsOnlineEvent(!isOnlineEvent)}
                                 className="rounded-lg whitespace-nowrap"
                              >
                                 {t("online")}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1">
                     <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                        <ImagePlus className="w-5 h-5 text-green-500" />
                        <span className="hidden sm:inline">{t("photo")}</span>
                     </Button>
                     <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                        <Video className="w-5 h-5 text-red-500" />
                        <span className="hidden sm:inline">{t("video")}</span>
                     </Button>
                     <Button
                        variant={isEventPost ? "default" : "ghost"}
                        size="sm"
                        className={`gap-2 rounded-xl ${isEventPost ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                        onClick={handleToggleEvent}
                     >
                        <Calendar className={`w-5 h-5 ${isEventPost ? "text-white" : "text-blue-500"}`} />
                        <span className="hidden sm:inline">{t("event")}</span>
                     </Button>
                     <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                        <Smile className="w-5 h-5 text-yellow-500" />
                        <span className="hidden sm:inline">{t("feeling")}</span>
                     </Button>
                  </div>
                  <Button
                     className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                     onClick={handleCreatePost}
                     disabled={!postContent.content.trim() || isPosting}
                  >
                     {isPosting ? t("posting") : t("post")}
                  </Button>
               </div>
            </div>
         )}

         {/* Posts Feed */}
         <div className="space-y-6">
            {posts.length > 0 ? (
               posts.map((post) => (
                  <PostCard
                     key={post.id}
                     author={{
                        name: post.profile?.name || "Unknown",
                        avatar: undefined,
                        time: formatPostTime(post.createdAt),
                     }}
                     content={post.content}
                     image={post.image}
                     likes={post.likesCount}
                     comments={post.commentsCount}
                     shares={post.sharesCount}
                     onViewDetails={() => onViewPostDetail?.(post)}
                  />
               ))
            ) : (
               <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500">{t("noPosts")}</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default HomeClient;
