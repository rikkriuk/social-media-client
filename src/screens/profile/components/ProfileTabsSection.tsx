import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCreationForm } from "./PostCreationForm";
import { ProfilePosts } from "./ProfilePosts";
import { ProfileAbout } from "./ProfileAbout";
import type { ProfileTabsSectionProps } from "@/types/profile";

export const ProfileTabsSection = ({
   isOwnProfile,
   profileData,
   initialUser,
   posts,
   postContent,
   setPostContent,
   isEventPost,
   onToggleEvent,
   eventDate,
   setEventDate,
   eventTime,
   setEventTime,
   eventLocation,
   setEventLocation,
   isOnlineEvent,
   setIsOnlineEvent,
   isPosting,
   onCreatePost,
   currentProfileId,
   totalPosts,
   formatPostTime,
   onLikeChange,
   tHome,
   tDate,
   t,
}: ProfileTabsSectionProps) => {
   return (
      <Tabs defaultValue="posts" className="w-full">
         <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
            <TabsTrigger value="posts" className="rounded-xl">
               {t("posts")}
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-xl">
               {t("media")}
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl">
               {t("about")}
            </TabsTrigger>
         </TabsList>

         <TabsContent value="posts" className="space-y-6">
            {isOwnProfile && (
               <PostCreationForm
                  profileData={profileData}
                  initialUser={initialUser}
                  postContent={postContent}
                  setPostContent={setPostContent}
                  isEventPost={isEventPost}
                  onToggleEvent={onToggleEvent}
                  eventDate={eventDate}
                  setEventDate={setEventDate}
                  eventTime={eventTime}
                  setEventTime={setEventTime}
                  eventLocation={eventLocation}
                  setEventLocation={setEventLocation}
                  isOnlineEvent={isOnlineEvent}
                  setIsOnlineEvent={setIsOnlineEvent}
                  isPosting={isPosting}
                  onCreatePost={onCreatePost}
                  tHome={tHome}
               />
            )}

            <ProfilePosts
               posts={posts}
               profileData={profileData}
               initialUser={initialUser}
               currentProfileId={currentProfileId}
               formatPostTime={formatPostTime}
               onLikeChange={onLikeChange}
               isOwnProfile={isOwnProfile}
               totalPosts={totalPosts}
               t={t}
            />
         </TabsContent>

         <TabsContent value="media">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
               <p className="text-gray-500">{t("noMediaYet")}</p>
            </div>
         </TabsContent>

         <TabsContent value="about">
            <ProfileAbout
               profileData={profileData}
               initialUser={initialUser}
               tDate={tDate}
               t={t}
            />
         </TabsContent>
      </Tabs>
   );
};
