import { X, ImagePlus, Video, Calendar, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EventDetailsForm } from "./EventDetailsForm";

interface CreatePostSectionProps {
   currentProfile: any;
   postContent: {
      content: string;
      mediaIds: string[];
   };
   onContentChange: (content: string) => void;
   isEventPost: boolean;
   onToggleEvent: () => void;
   eventDate: string;
   onEventDateChange: (date: string) => void;
   eventTime: string;
   onEventTimeChange: (time: string) => void;
   eventLocation: string;
   onEventLocationChange: (location: string) => void;
   isOnlineEvent: boolean;
   onToggleOnlineEvent: () => void;
   isPosting: boolean;
   onCreatePost: () => void;
   tFunc: (key: string, options?: any) => string;
}

export const CreatePostSection = ({
   currentProfile,
   postContent,
   onContentChange,
   isEventPost,
   onToggleEvent,
   eventDate,
   onEventDateChange,
   eventTime,
   onEventTimeChange,
   eventLocation,
   onEventLocationChange,
   isOnlineEvent,
   onToggleOnlineEvent,
   isPosting,
   onCreatePost,
   tFunc,
}: CreatePostSectionProps) => {
   const getAvatarInitial = () => {
      if (currentProfile?.name) {
         return currentProfile.name.charAt(0).toUpperCase();
      }
      return "U";
   };

   return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
         <div className="flex items-start gap-3">
            <Avatar>
               <AvatarFallback>{getAvatarInitial()}</AvatarFallback>
            </Avatar>
            <Textarea
               placeholder={tFunc("whatsOnYourMind")}
               value={postContent.content}
               onChange={(e) => onContentChange(e.target.value)}
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
                     {tFunc("eventDetails")}
                  </span>
                  <button
                     onClick={onToggleEvent}
                     className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                     <X className="w-4 h-4" />
                  </button>
               </div>
               <EventDetailsForm
                  eventDate={eventDate}
                  onEventDateChange={onEventDateChange}
                  eventTime={eventTime}
                  onEventTimeChange={onEventTimeChange}
                  eventLocation={eventLocation}
                  onEventLocationChange={onEventLocationChange}
                  isOnlineEvent={isOnlineEvent}
                  onToggleOnlineEvent={onToggleOnlineEvent}
                  tFunc={tFunc}
               />
            </div>
         )}

         <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
               <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                  <ImagePlus className="w-5 h-5 text-green-500" />
                  <span className="hidden sm:inline">{tFunc("photo")}</span>
               </Button>
               <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                  <Video className="w-5 h-5 text-red-500" />
                  <span className="hidden sm:inline">{tFunc("video")}</span>
               </Button>
               <Button
                  variant={isEventPost ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-xl ${
                  isEventPost ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"
               }`}
                  onClick={onToggleEvent}
               >
                  <Calendar className={`w-5 h-5 ${isEventPost ? "text-white" : "text-blue-500"}`} />
                  <span className="hidden sm:inline">{tFunc("event")}</span>
               </Button>
               <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                  <Smile className="w-5 h-5 text-yellow-500" />
                  <span className="hidden sm:inline">{tFunc("feeling")}</span>
               </Button>
            </div>
            <Button
               className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
               onClick={onCreatePost}
               disabled={!postContent.content.trim() || isPosting}
            >
               {isPosting ? tFunc("posting") : tFunc("post")}
            </Button>
         </div>
      </div>
   );
};
