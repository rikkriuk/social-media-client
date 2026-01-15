"use client"

import { Heart, MessageCircle, UserPlus, Share2 } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const NotificationsPage = () => {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "notifications");

  const notifications = [
    {
      type: "like",
      user: "Sarah Johnson",
      avatar: undefined,
      action: "liked your post",
      time: "5 " + t("minutesAgo"),
      read: false,
    },
    {
      type: "comment",
      user: "Michael Chen",
      avatar: undefined,
      action: "commented on your photo",
      time: "15 " + t("minutesAgo"),
      read: false,
    },
    {
      type: "follow",
      user: "Emma Wilson",
      avatar: undefined,
      action: "started following you",
      time: "1 " + t("hoursAgo"),
      read: false,
    },
    {
      type: "share",
      user: "David Brown",
      avatar: undefined,
      action: "shared your post",
      time: "2 " + t("hoursAgo"),
      read: true,
    },
    {
      type: "like",
      user: "Lisa Anderson",
      avatar: undefined,
      action: "liked your comment",
      time: "3 " + t("hoursAgo"),
      read: true,
    },
    {
      type: "comment",
      user: "John Smith",
      avatar: undefined,
      action: "replied to your comment",
      time: "5 " + t("hoursAgo"),
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "share":
        return <Share2 className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex-1 px-4 py-6 pb-20 md:pb-6">
      <h1 className="text-gray-900 dark:text-white text-2xl mb-6 font-semibold">{t("notifications")}</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6 bg-gray-100 dark:bg-gray-800 p-0">
          <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900">
            {t("all")}
          </TabsTrigger>
          <TabsTrigger value="unread" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900">
            {t("unread")}
          </TabsTrigger>
          <TabsTrigger value="mentions" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900">
            {t("mentions")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className={`p-4 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer ${
                  !notif.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={notif.avatar} />
                    <AvatarFallback>{notif.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">{notif.user}</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{notif.action}</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {notifications
              .filter((n) => !n.read)
              .map((notif, index) => (
                <div
                  key={index}
                  className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer bg-blue-50/50 dark:bg-blue-900/10"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={notif.avatar} />
                      <AvatarFallback>{notif.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1">
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white">
                      <span className="font-medium">{notif.user}</span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">{notif.action}</span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{notif.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mentions">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">{t("noMentions")}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NotificationsPage;