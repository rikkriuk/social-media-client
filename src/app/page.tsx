"use client";

import { ImagePlus, Video, Smile } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { Textarea } from "@/components/ui/textarea";

interface HomePageProps {
  onViewPostDetail: (post: any) => void;
}

const HomePage = ({ onViewPostDetail }: HomePageProps) => {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "home");

  const posts = [
    {
      author: {
        name: "Sarah Johnson",
        avatar: undefined,
        time: "2 " + t("hoursAgo"),
      },
      content: "Just visited this amazing place! The view was absolutely breathtaking. Can\"t wait to go back again! 🌄",
      image: "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYwMTEyNzQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 124,
      comments: 18,
      shares: 5,
    },
    {
      author: {
        name: "Michael Chen",
        avatar: undefined,
        time: "5 " + t("hoursAgo"),
      },
      content: "Architecture in the city never fails to inspire me. Modern design meets classic beauty.",
      image: "https://images.unsplash.com/photo-1617381519460-d87050ddeb92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MDA1MDc2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 89,
      comments: 12,
      shares: 3,
    },
    {
      author: {
        name: "Emma Wilson",
        avatar: undefined,
        time: "1 day ago",
      },
      content: "Tried this new recipe today and it turned out amazing! 😍 Who wants the recipe?",
      image: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzYwMTE4MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 256,
      comments: 45,
      shares: 12,
    },
    {
      author: {
        name: "David Brown",
        avatar: undefined,
        time: "2 days ago",
      },
      content: "Great meeting with the team today! Excited about our new project launch next week. Stay tuned! 🚀",
      image: undefined,
      likes: 67,
      comments: 8,
      shares: 2,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Create Post */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder={t("whatsOnYourMind")}
            className="flex-1 resize-none border-0 focus-visible:ring-0 bg-gray-100 dark:bg-gray-800 rounded-xl"
            rows={2}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
              <ImagePlus className="w-5 h-5 text-green-500" />
              {t("photo")}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
              <Video className="w-5 h-5 text-red-500" />
              {t("video")}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
              <Smile className="w-5 h-5 text-yellow-500" />
              {t("feeling")}
            </Button>
          </div>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            {t("post")}
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <PostCard 
            key={index} 
            {...post} 
            onViewDetails={() => onViewPostDetail(post)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;