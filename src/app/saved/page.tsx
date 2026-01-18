"use client";

import { useState } from "react";
import { Bookmark, Trash2, ExternalLink, MoreHorizontal, FolderPlus, Grid, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SavedItem {
   id: string;
   type: "post" | "article" | "video";
   title: string;
   description: string;
   image?: string;
   author: {
      name: string;
      avatar?: string;
   };
   savedAt: string;
   collection?: string;
}

interface Collection {
   id: string;
   name: string;
   count: number;
   cover?: string;
}

const SavedPage = () => {
   const [viewMode, setViewMode] = useState<"grid" | "list">("list");

   const collections: Collection[] = [
      { id: "1", name: "Tech Articles", count: 12 },
      { id: "2", name: "Design Inspiration", count: 8 },
      { id: "3", name: "Recipes", count: 5 },
      { id: "4", name: "Travel Ideas", count: 15 },
   ];

   const savedItems: SavedItem[] = [
      {
         id: "1",
         type: "post",
         title: "Amazing sunset at the beach",
         description: "Just visited this amazing place! The view was absolutely breathtaking...",
         image: "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400",
         author: { name: "Sarah Johnson" },
         savedAt: "2 hours ago",
         collection: "Travel Ideas",
      },
      {
         id: "2",
         type: "article",
         title: "10 Tips for Better Productivity",
         description: "Learn how to maximize your productivity with these simple but effective tips...",
         author: { name: "Tech Weekly" },
         savedAt: "1 day ago",
         collection: "Tech Articles",
      },
      {
         id: "3",
         type: "video",
         title: "How to Make Perfect Pasta",
         description: "A step-by-step guide to making authentic Italian pasta from scratch...",
         image: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400",
         author: { name: "Chef Emma" },
         savedAt: "3 days ago",
         collection: "Recipes",
      },
      {
         id: "4",
         type: "post",
         title: "Modern Architecture in Tokyo",
         description: "Architecture in the city never fails to inspire me. Modern design meets classic beauty...",
         image: "https://images.unsplash.com/photo-1617381519460-d87050ddeb92?w=400",
         author: { name: "Michael Chen" },
         savedAt: "1 week ago",
         collection: "Design Inspiration",
      },
      {
         id: "5",
         type: "article",
         title: "The Future of AI in 2025",
         description: "Exploring the latest advancements in artificial intelligence and what to expect...",
         author: { name: "AI Research Lab" },
         savedAt: "2 weeks ago",
         collection: "Tech Articles",
      },
   ];

   const SavedItemCard = ({ item }: { item: SavedItem }) => (
      <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${viewMode === "grid" ? "" : "flex"}`}>
         {item.image && (
            <div className={viewMode === "grid" ? "h-40 w-full" : "w-32 h-32 flex-shrink-0"}>
               <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
         )}
         <div className="p-4 flex-1">
            <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === "post" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                        item.type === "article" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                     }`}>
                        {item.type}
                     </span>
                     {item.collection && (
                        <span className="text-xs text-gray-400">{item.collection}</span>
                     )}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
               </div>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button size="icon" variant="ghost" className="rounded-xl flex-shrink-0">
                        <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                     <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Move to Collection
                     </DropdownMenuItem>
                     <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            <div className="flex items-center justify-between mt-3">
               <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                     <AvatarImage src={item.author.avatar} />
                     <AvatarFallback className="text-xs">{item.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500">{item.author.name}</span>
               </div>
               <span className="text-xs text-gray-400">Saved {item.savedAt}</span>
            </div>
         </div>
      </div>
   );

   const CollectionCard = ({ collection }: { collection: Collection }) => (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
         <div className="w-full h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mb-3 flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-white" />
         </div>
         <h3 className="font-semibold text-gray-900 dark:text-white">{collection.name}</h3>
         <p className="text-sm text-gray-500">{collection.count} items</p>
      </div>
   );

   return (
      <div className="max-w-4xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Saved</h1>
               <p className="text-gray-500">Your saved posts, articles, and more</p>
            </div>
            <div className="flex items-center gap-2">
               <Button
                  size="icon"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setViewMode("list")}
               >
                  <List className="w-5 h-5" />
               </Button>
               <Button
                  size="icon"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setViewMode("grid")}
               >
                  <Grid className="w-5 h-5" />
               </Button>
            </div>
         </div>

         <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
               <TabsTrigger value="all" className="rounded-xl">
                  All Items
               </TabsTrigger>
               <TabsTrigger value="collections" className="rounded-xl">
                  Collections
               </TabsTrigger>
               <TabsTrigger value="recent" className="rounded-xl">
                  Recently Saved
               </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
               <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                  {savedItems.map((item) => (
                     <SavedItemCard key={item.id} item={item} />
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="collections">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                     <div className="w-full h-24 rounded-xl mb-3 flex items-center justify-center">
                        <FolderPlus className="w-8 h-8 text-gray-400" />
                     </div>
                     <h3 className="font-semibold text-gray-500 text-center">New Collection</h3>
                  </div>
                  {collections.map((collection) => (
                     <CollectionCard key={collection.id} collection={collection} />
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="recent">
               <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                  {savedItems.slice(0, 3).map((item) => (
                     <SavedItemCard key={item.id} item={item} />
                  ))}
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default SavedPage;
