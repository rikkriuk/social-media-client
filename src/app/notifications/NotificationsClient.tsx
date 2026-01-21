"use client"

import { Heart, MessageCircle, UserPlus, Loader2, Trash2 } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useState, useEffect } from "react";
import { webRequest } from "@/helpers/api";
import useAuth from "@/zustand/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NotificationData {
   id: string;
   type: 'like' | 'comment' | 'follow';
   recipientProfileId: string;
   actorProfileId: string;
   actor?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
   };
   postId?: string;
   commentId?: string;
   isRead: boolean;
   createdAt: string;
}

const NotificationsPage = () => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "notifications");
   const { currentUser } = useAuth();

   const [allNotifications, setAllNotifications] = useState<NotificationData[]>([]);
   const [unreadNotifications, setUnreadNotifications] = useState<NotificationData[]>([]);
   const [readNotifications, setReadNotifications] = useState<NotificationData[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState("all");

   useEffect(() => {
      if (!currentUser?.profileId) return;
      fetchNotifications();
   }, [currentUser?.profileId]);

   const fetchNotifications = async () => {
      if (!currentUser?.profileId) return;
      
      try {
         setIsLoading(true);
         const response = await webRequest.get("/notifications", {
            params: {
               recipientProfileId: currentUser.profileId,
               limit: 50,
               offset: 0,
            },
         });

         const notifications = response.data?.data?.rows || response.data?.rows || [];
         setAllNotifications(notifications);
         setUnreadNotifications(notifications.filter((n: NotificationData) => !n.isRead));
         setReadNotifications(notifications.filter((n: NotificationData) => n.isRead));
      } catch (error) {
         console.error("Failed to fetch notifications:", error);
         toast.error(t("errorLoadingNotifications") || "Failed to load notifications");
      } finally {
         setIsLoading(false);
      }
   };

   const handleMarkAsRead = async (notificationId: string) => {
      try {
         setMarkingAsRead(notificationId);
         await webRequest.post(`/notifications/${notificationId}/mark-as-read`);
         
         // Update local state
         const updatedAll = allNotifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
         );
         setAllNotifications(updatedAll);
         setUnreadNotifications(updatedAll.filter(n => !n.isRead));
         setReadNotifications(updatedAll.filter(n => n.isRead));
      } catch (error) {
         console.error("Failed to mark notification as read:", error);
         toast.error(t("errorUpdatingNotification") || "Failed to update notification");
      } finally {
         setMarkingAsRead(null);
      }
   };

   const handleMarkAllAsRead = async () => {
      if (!currentUser?.profileId) return;
      
      try {
         await webRequest.post("/notifications/mark-all-as-read", {
            recipientProfileId: currentUser.profileId,
         });
         
         const updated = allNotifications.map(n => ({ ...n, isRead: true }));
         setAllNotifications(updated);
         setUnreadNotifications([]);
         setReadNotifications(updated);
         toast.success(t("allMarkedAsRead") || "All notifications marked as read");
      } catch (error) {
         console.error("Failed to mark all as read:", error);
         toast.error(t("errorUpdatingNotifications") || "Failed to update notifications");
      }
   };

   const getActorName = (notification: NotificationData): string => {
      return notification.actor
         ? `${notification.actor.firstName || ""} ${notification.actor.lastName || ""}`.trim()
         : "Unknown";
   };

   const getActorAvatar = (notification: NotificationData): string | undefined => {
      return notification.actor?.avatar;
   };

   const getActionText = (notification: NotificationData): string => {
      switch (notification.type) {
         case "like":
            return t("likedYourPost") || "liked your post";
         case "comment":
            return t("commentedOnYourPost") || "commented on your post";
         case "follow":
            return t("startedFollowingYou") || "started following you";
         default:
            return "interacted with you";
      }
   };

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

   const formatTime = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return t("justNow") || "just now";
      if (diffMins < 60) return `${diffMins} ${t("minutesAgo") || "minutes ago"}`;
      if (diffHours < 24) return `${diffHours} ${t("hoursAgo") || "hours ago"}`;
      if (diffDays < 7) return `${diffDays} ${t("daysAgo") || "days ago"}`;
      
      return date.toLocaleDateString();
   };

   const renderNotificationsList = (notifications: NotificationData[], isUnread: boolean = false) => {
      if (notifications.length === 0) {
         return (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
               <p className="text-gray-500">{isUnread ? t("noUnreadNotifications") : t("noReadNotifications")}</p>
            </div>
         );
      }

      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {notifications.map((notif) => (
               <div
                  key={notif.id}
                  className={`p-4 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group ${
                     !notif.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
               >
                  <div className="relative flex-shrink-0">
                     <Avatar>
                        <AvatarImage src={getActorAvatar(notif)} />
                        <AvatarFallback>{getActorName(notif)[0]}</AvatarFallback>
                     </Avatar>
                     <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1">
                        {getIcon(notif.type)}
                     </div>
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-gray-900 dark:text-white">
                        <span className="font-medium">{getActorName(notif)}</span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">{getActionText(notif)}</span>
                     </p>
                     <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{formatTime(notif.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                     {!notif.isRead && (
                        <>
                           <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notif.id)}
                              disabled={markingAsRead === notif.id}
                              className="h-8 w-8 p-0"
                           >
                              {markingAsRead === notif.id ? (
                                 <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                 <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                           </Button>
                        </>
                     )}
                  </div>
               </div>
            ))}
         </div>
      );
   };

   return (
      <div className="max-w-3xl mx-auto flex-1 px-4 py-6 pb-20 md:pb-6">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-gray-900 dark:text-white text-2xl font-semibold">{t("notifications")}</h1>
            {unreadNotifications.length > 0 && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 dark:text-blue-400"
               >
                  {t("markAllAsRead") || "Mark all as read"}
               </Button>
            )}
         </div>

         {isLoading ? (
            <div className="flex justify-center items-center py-12">
               <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
         ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6 bg-gray-100 dark:bg-gray-800 p-0">
                  <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900">
                     {t("all")} ({allNotifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900">
                     {t("unread")} ({unreadNotifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="read" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900">
                     {t("read")} ({readNotifications.length})
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="all">
                  {renderNotificationsList(allNotifications)}
               </TabsContent>

               <TabsContent value="unread">
                  {renderNotificationsList(unreadNotifications, true)}
               </TabsContent>

               <TabsContent value="read">
                  {renderNotificationsList(readNotifications)}
               </TabsContent>
            </Tabs>
         )}
      </div>
   );
}

export default NotificationsPage;
