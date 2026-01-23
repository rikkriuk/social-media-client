import { Heart, MessageCircle, UserPlus, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationData } from "../hooks/useNotificationsLogic";
import {
   getActorName,
   getActorAvatar,
   getActionText,
   formatTime,
} from "../hooks/notificationHelpers";

interface NotificationItemProps {
   notification: NotificationData;
   isMarking: boolean;
   onMarkAsRead: (id: string) => void;
   t: (key: string) => string | undefined;
}

export const NotificationItem = ({
   notification,
   isMarking,
   onMarkAsRead,
   t,
}: NotificationItemProps) => {
   const getIcon = (type: string) => {
      switch (type) {
         case "like":
            return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
         case "comment":
            return <MessageCircle className="w-5 h-5 text-blue-500" />;
         case "follow":
            return <UserPlus className="w-5 h-5 text-green-500" />;
         default:
            return null;
      }
   };

   return (
      <div
         className={`p-4 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group ${
            !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
         }`}
      >
         <div className="relative flex-shrink-0">
            <Avatar>
               <AvatarImage src={getActorAvatar(notification)} />
               <AvatarFallback>{getActorName(notification)[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1">
               {getIcon(notification.type)}
            </div>
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white">
               <span className="font-medium">{getActorName(notification)}</span>{" "}
               <span className="text-gray-600 dark:text-gray-400">
                  {getActionText(notification, t)}
               </span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
               {formatTime(notification.createdAt, t)}
            </p>
         </div>
         <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.isRead && (
               <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMarkAsRead(notification.id)}
                  disabled={isMarking}
                  className="h-8 w-8 p-0"
               >
                  {isMarking ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                     <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
               </Button>
            )}
         </div>
      </div>
   );
};
