import { NotificationData } from "./useNotificationsLogic";

export const getActorName = (notification: NotificationData): string => {
   return notification.actor
      ? `${notification.actor.firstName || ""} ${notification.actor.lastName || ""}`.trim()
      : "Unknown";
};

export const getActorAvatar = (notification: NotificationData): string | undefined => {
   return notification.actor?.avatar;
};

export const getActionText = (
   notification: NotificationData,
   t: (key: string) => string | undefined
): string => {
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

export const getIcon = (type: string) => {
   switch (type) {
      case "like":
         return { color: "text-red-500 fill-red-500", icon: "heart" };
      case "comment":
         return { color: "text-blue-500", icon: "comment" };
      case "follow":
         return { color: "text-green-500", icon: "follow" };
      default:
         return { color: "", icon: "" };
   }
};

export const formatTime = (dateString: string, t: (key: string) => string | undefined): string => {
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
