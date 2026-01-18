"use client";

import { useState } from "react";
import { TrendingUp, Hash, Flame, Clock, MessageCircle, Heart, Share2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TrendingTopic {
   id: string;
   hashtag: string;
   category: string;
   posts: number;
   change: number;
}

interface TrendingPost {
   id: string;
   author: {
      name: string;
      username: string;
      avatar?: string;
      verified?: boolean;
   };
   content: string;
   image?: string;
   likes: number;
   comments: number;
   shares: number;
   time: string;
   hashtags: string[];
}

interface TrendingNews {
   id: string;
   title: string;
   source: string;
   image?: string;
   time: string;
   category: string;
}

const TrendingPage = () => {
   const [selectedCategory, setSelectedCategory] = useState("All");

   const trendingTopics: TrendingTopic[] = [
      { id: "1", hashtag: "TechIndonesia", category: "Technology", posts: 12500, change: 25 },
      { id: "2", hashtag: "MondayMotivation", category: "Lifestyle", posts: 8700, change: 15 },
      { id: "3", hashtag: "WorldNews", category: "News", posts: 45000, change: 120 },
      { id: "4", hashtag: "GamersUnite", category: "Gaming", posts: 6800, change: 8 },
      { id: "5", hashtag: "FoodieLife", category: "Food", posts: 5400, change: 12 },
      { id: "6", hashtag: "StartupLife", category: "Business", posts: 3200, change: 5 },
      { id: "7", hashtag: "Photography", category: "Art", posts: 9100, change: 18 },
      { id: "8", hashtag: "FitnessGoals", category: "Health", posts: 4500, change: 10 },
   ];

   const trendingPosts: TrendingPost[] = [
      {
         id: "1",
         author: { name: "Tech News", username: "technews", verified: true },
         content: "Breaking: New AI breakthrough announced today! This could change everything we know about machine learning. #TechIndonesia #AI",
         likes: 2500,
         comments: 342,
         shares: 891,
         time: "2h",
         hashtags: ["TechIndonesia", "AI"],
      },
      {
         id: "2",
         author: { name: "Sarah Creator", username: "sarahcreator" },
         content: "Just finished this amazing digital art piece! What do you think? #Photography #Art",
         image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",
         likes: 1800,
         comments: 156,
         shares: 234,
         time: "4h",
         hashtags: ["Photography", "Art"],
      },
      {
         id: "3",
         author: { name: "Gaming World", username: "gamingworld", verified: true },
         content: "The new game everyone is talking about just dropped! Who's playing? #GamersUnite",
         image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
         likes: 3200,
         comments: 567,
         shares: 1200,
         time: "5h",
         hashtags: ["GamersUnite"],
      },
      {
         id: "4",
         author: { name: "Fitness Pro", username: "fitnesspro" },
         content: "Remember: Progress is progress, no matter how small. Keep pushing! #FitnessGoals #MondayMotivation",
         likes: 980,
         comments: 89,
         shares: 156,
         time: "6h",
         hashtags: ["FitnessGoals", "MondayMotivation"],
      },
   ];

   const trendingNews: TrendingNews[] = [
      {
         id: "1",
         title: "Major Tech Company Announces Revolutionary New Product",
         source: "Tech Daily",
         image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
         time: "1h ago",
         category: "Technology",
      },
      {
         id: "2",
         title: "Global Climate Summit Reaches Historic Agreement",
         source: "World News",
         time: "3h ago",
         category: "World",
      },
      {
         id: "3",
         title: "Local Startup Raises $50M in Series B Funding",
         source: "Business Insider",
         time: "5h ago",
         category: "Business",
      },
      {
         id: "4",
         title: "New Study Reveals Surprising Health Benefits",
         source: "Health Today",
         time: "6h ago",
         category: "Health",
      },
   ];

   const categories = ["All", "Technology", "News", "Gaming", "Lifestyle", "Business", "Health"];

   const formatNumber = (num: number): string => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
      if (num >= 1000) return (num / 1000).toFixed(1) + "K";
      return num.toString();
   };

   const TrendingTopicCard = ({ topic, rank }: { topic: TrendingTopic; rank: number }) => (
      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors">
         <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 w-8">{rank}</span>
         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
               <Hash className="w-4 h-4 text-blue-500" />
               <span className="font-semibold text-gray-900 dark:text-white">{topic.hashtag}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
               <span>{topic.category}</span>
               <span>•</span>
               <span>{formatNumber(topic.posts)} posts</span>
            </div>
         </div>
         <div className="flex items-center gap-1 text-green-500 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{topic.change}%</span>
         </div>
      </div>
   );

   const TrendingPostCard = ({ post }: { post: TrendingPost }) => (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="flex items-start gap-3">
            <Avatar>
               <AvatarImage src={post.author.avatar} />
               <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{post.author.name}</span>
                  {post.author.verified && (
                     <Badge variant="secondary" className="rounded-full text-xs px-1.5 py-0 bg-blue-100 text-blue-600">
                        ✓
                     </Badge>
                  )}
                  <span className="text-gray-500">@{post.author.username}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-sm">{post.time}</span>
               </div>
               <p className="text-gray-900 dark:text-white mt-1">{post.content}</p>
               {post.image && (
                  <div className="mt-3 rounded-xl overflow-hidden">
                     <img src={post.image} alt="" className="w-full h-48 object-cover" />
                  </div>
               )}
               <div className="flex items-center gap-6 mt-3 text-gray-500">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                     <Heart className="w-5 h-5" />
                     <span className="text-sm">{formatNumber(post.likes)}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                     <MessageCircle className="w-5 h-5" />
                     <span className="text-sm">{formatNumber(post.comments)}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                     <Share2 className="w-5 h-5" />
                     <span className="text-sm">{formatNumber(post.shares)}</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );

   const NewsCard = ({ news }: { news: TrendingNews }) => (
      <div className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors">
         {news.image && (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
               <img src={news.image} alt="" className="w-full h-full object-cover" />
            </div>
         )}
         <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="rounded-full text-xs mb-1">
               {news.category}
            </Badge>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">{news.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
               <span>{news.source}</span>
               <span>•</span>
               <Clock className="w-3 h-3" />
               <span>{news.time}</span>
            </div>
         </div>
         <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
   );

   return (
      <div className="max-w-4xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <Flame className="w-6 h-6 text-orange-500" />
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending</h1>
            </div>
            <p className="text-gray-500">See what's happening right now</p>
         </div>

         {/* Categories */}
         <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {categories.map((category) => (
               <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full flex-shrink-0"
                  onClick={() => setSelectedCategory(category)}
               >
                  {category}
               </Button>
            ))}
         </div>

         <Tabs defaultValue="topics" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
               <TabsTrigger value="topics" className="rounded-xl">
                  <Hash className="w-4 h-4 mr-2" />
                  Topics
               </TabsTrigger>
               <TabsTrigger value="posts" className="rounded-xl">
                  <Flame className="w-4 h-4 mr-2" />
                  Posts
               </TabsTrigger>
               <TabsTrigger value="news" className="rounded-xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  News
               </TabsTrigger>
            </TabsList>

            <TabsContent value="topics">
               <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                  {trendingTopics
                     .filter((t) => selectedCategory === "All" || t.category === selectedCategory)
                     .map((topic, index) => (
                        <TrendingTopicCard key={topic.id} topic={topic} rank={index + 1} />
                     ))}
               </div>
            </TabsContent>

            <TabsContent value="posts" className="space-y-4">
               {trendingPosts
                  .filter(
                     (p) =>
                        selectedCategory === "All" ||
                        p.hashtags.some((h) =>
                           trendingTopics.find((t) => t.hashtag === h && t.category === selectedCategory)
                        )
                  )
                  .map((post) => (
                     <TrendingPostCard key={post.id} post={post} />
                  ))}
            </TabsContent>

            <TabsContent value="news">
               <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                  {trendingNews
                     .filter((n) => selectedCategory === "All" || n.category === selectedCategory)
                     .map((news) => (
                        <NewsCard key={news.id} news={news} />
                     ))}
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default TrendingPage;
