import { Calendar, ImagePlus, Video, Smile, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PostCreationFormProps } from "@/types/profile";

export const PostCreationForm = ({
   profileData,
   initialUser,
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
   tHome,
}: PostCreationFormProps) => {
   const getInitialAvatarFallback = () => {
      const initial = profileData?.name
         ? profileData.name.charAt(0).toUpperCase()
         : initialUser?.username.charAt(0).toUpperCase();
      return initial;
   };

   return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
         <div className="flex items-start gap-3">
            <Avatar>
               <AvatarFallback>{getInitialAvatarFallback()}</AvatarFallback>
            </Avatar>
            <Textarea
               placeholder={tHome("whatsOnYourMind")}
               value={postContent.content}
               onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
               className="flex-1 resize-none border-0 focus-visible:ring-0 bg-gray-100 dark:bg-gray-800 rounded-xl"
               rows={2}
            />
         </div>

         {isEventPost && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
               <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                     <Calendar className="w-4 h-4" />
                     {tHome("eventDetails")}
                  </span>
                  <button
                     onClick={onToggleEvent}
                     className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                     <X className="w-4 h-4" />
                  </button>
               </div>
               <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-xs text-gray-500 mb-1 block">{tHome("date")}</label>
                        <Input
                           type="date"
                           value={eventDate}
                           onChange={(e) => setEventDate(e.target.value)}
                           className="rounded-lg text-sm"
                        />
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 mb-1 block">{tHome("time")}</label>
                        <Input
                           type="time"
                           value={eventTime}
                           onChange={(e) => setEventTime(e.target.value)}
                           className="rounded-lg text-sm"
                        />
                     </div>
                  </div>
                  <div>
                     <label className="text-xs text-gray-500 mb-1 block">{tHome("location")}</label>
                     <div className="flex gap-2">
                        <Input
                           placeholder={tHome("enterLocation")}
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
                           {tHome("online")}
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
                  <span className="hidden sm:inline">{tHome("photo")}</span>
               </Button>
               <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                  <Video className="w-5 h-5 text-red-500" />
                  <span className="hidden sm:inline">{tHome("video")}</span>
               </Button>
               <Button
                  variant={isEventPost ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-xl ${isEventPost ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                  onClick={onToggleEvent}
               >
                  <Calendar className={`w-5 h-5 ${isEventPost ? "text-white" : "text-blue-500"}`} />
                  <span className="hidden sm:inline">{tHome("event")}</span>
               </Button>
               <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                  <Smile className="w-5 h-5 text-yellow-500" />
                  <span className="hidden sm:inline">{tHome("feeling")}</span>
               </Button>
            </div>
            <Button
               className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
               onClick={onCreatePost}
               disabled={!postContent.content.trim() || isPosting}
            >
               {isPosting ? tHome("posting") : tHome("post")}
            </Button>
         </div>
      </div>
   );
};
