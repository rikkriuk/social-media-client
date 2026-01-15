import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";

interface Comment {
   id: number;
   author: {
      name: string;
      avatar?: string;
   };
   content: string;
   time: string;
}

interface PostCardProps {
   author: {
      name: string;
      avatar?: string;
      time: string;
   };
   content: string;
   image?: string;
   likes: number;
   comments: number;
   shares: number;
   onViewDetails?: () => void;
}

const previewComments: Comment[] = [
   {
      id: 1,
      author: {
         name: "Alex Thompson",
         avatar: undefined,
      },
      content: "This is amazing! Great work! 🎉",
      time: "1h ago",
   },
   {
      id: 2,
      author: {
         name: "Sophie Martin",
         avatar: undefined,
      },
      content: "Love this! Keep it up!",
      time: "30m ago",
   },
];

export function PostCard({ author, content, image, likes, comments, shares, onViewDetails }: PostCardProps) {
   const [isLiked, setIsLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(likes);
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "post");

   const handleLike = () => {
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
   };

   return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
         {/* Header */}
         <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Avatar>
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
               </Avatar>
               <div>
                  <p className="text-gray-900 dark:text-white">{author.name}</p>
                  <p className="text-gray-500 text-sm">{author.time}</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
               <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </Button>
         </div>

         {/* Content */}
         <div className="px-4 pb-3">
         <p className="text-gray-900 dark:text-white">{content}</p>
         </div>

         {/* Image */}
         {image && (
         <div className="w-full cursor-pointer" onClick={onViewDetails}>
            <img src={image} alt="Post" className="w-full object-cover max-h-96 hover:opacity-95 transition-opacity" />
         </div>
         )}

         {/* Stats */}
         <div className="px-4 py-3 flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 dark:border-gray-800">
            <span>{likeCount} {t("like")}</span>
            <div className="flex gap-4">
               <button 
                  className="hover:underline cursor-pointer"
                  onClick={onViewDetails}
               >
                  {comments} {t("comment")}
               </button>
               <span>{shares} {t("share")}</span>
            </div>
         </div>

         {/* Actions */}
         <div className="px-4 pb-4 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-2">
            <Button
               variant="ghost"
               className={`flex-1 gap-2 rounded-xl ${
                  isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600 dark:text-gray-400"
               }`}
               onClick={handleLike}
            >
               <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
               {t("like")}
            </Button>
            <Button 
               variant="ghost" 
               className="flex-1 gap-2 rounded-xl text-gray-600 dark:text-gray-400"
               onClick={onViewDetails}
            >
               <MessageCircle className="w-5 h-5" />
               {t("comment")}
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 rounded-xl text-gray-600 dark:text-gray-400">
               <Share2 className="w-5 h-5" />
               {t("share")}
            </Button>
         </div>

         {comments > 0 && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
               <div className="space-y-3">
                  {previewComments.slice(0, 2).map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                     <Avatar className="w-7 h-7">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                           {comment.author.name}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                           {comment.content}
                        </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-3">{comment.time}</p>
                     </div>
                  </div>
                  ))}
               </div>

               {comments > 2 && (
                  <button
                  onClick={onViewDetails}
                  className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mt-3 transition-colors"
                  >
                  {t("viewAll")} {comments} {t("comment")}
                  </button>
               )}
            </div>
         )}
      </div>
   );
}
