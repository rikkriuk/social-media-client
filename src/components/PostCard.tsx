import { Heart, MessageCircle, Share2, MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageLightbox } from "./ImageLightbox";
import { Button } from "./ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";

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
   postId?: string;
   profileId?: string;
   author: {
      name: string;
      avatar?: string;
      time: string;
   };
   content: string;
   image?: string;
   images?: string[];
   likes: number;
   comments: number;
   shares: number;
   initialIsLiked?: boolean;
   isOwnPost?: boolean;
   onViewDetails?: () => void;
   onLikeChange?: (postId: string, newLikeCount: number, isLiked: boolean) => void;
   onEdit?: () => void;
   onDelete?: () => void;
   onShare?: () => void;
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

export function PostCard({
   postId,
   profileId,
   author,
   content,
   image,
   images,
   likes,
   comments,
   shares,
   initialIsLiked = false,
   isOwnPost = false,
   onViewDetails,
   onLikeChange,
   onEdit,
   onDelete,
   onShare,
}: PostCardProps) {
   const [isLiked, setIsLiked] = useState(initialIsLiked);
   const [likeCount, setLikeCount] = useState(likes);
   const [isLikeLoading, setIsLikeLoading] = useState(false);
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [lightboxIndex, setLightboxIndex] = useState(0);

   // Merge images prop with legacy single image prop
   const allImages = images && images.length > 0 ? images : image ? [image] : [];
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "post");

   useEffect(() => {
      setLikeCount(likes);
   }, [likes]);

   useEffect(() => {
      setIsLiked(initialIsLiked);
   }, [initialIsLiked]);

   const handleLike = async () => {
      if (!postId || !profileId) {
         setIsLiked(!isLiked);
         setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
         return;
      }

      setIsLikeLoading(true);
      try {
         const response = await webRequest.post("/like", {
            type: isLiked ? "unlike" : "like",
            postId,
            profileId,
         });

         if (response.data.ok) {
            const newLikeCount = response.data.data.likesCount;
            const newIsLiked = !isLiked;

            setIsLiked(newIsLiked);
            setLikeCount(newLikeCount);

            if (onLikeChange) {
               onLikeChange(postId, newLikeCount, newIsLiked);
            }
         } else {
            toast.error(response.data.message || t("likeFailed"));
         }
      } catch (error: any) {
         console.error("Like error:", error);
         toast.error(error?.data?.message || t("likeFailed"));
      } finally {
         setIsLikeLoading(false);
      }
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
            {isOwnPost && (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                     <DropdownMenuItem onClick={onViewDetails} className="flex gap-2 cursor-pointer">
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={onEdit} className="flex gap-2 cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={onDelete} className="flex gap-2 cursor-pointer text-red-600">
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            )}
            {!isOwnPost && (
               <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
               </Button>
            )}
         </div>

         {/* Content */}
         <div className="px-4 pb-3">
         <p className="text-gray-900 dark:text-white">{content}</p>
         </div>

         {/* Images */}
         {allImages.length > 0 && (
            <div
               className={`w-full ${
                  allImages.length === 1
                     ? ""
                     : allImages.length === 2
                     ? "grid grid-cols-2 gap-0.5"
                     : "grid grid-cols-2 gap-0.5"
               }`}
            >
               {allImages.slice(0, 4).map((imgUrl, index) => (
                  <div
                     key={index}
                     className={`relative cursor-pointer overflow-hidden ${
                        allImages.length === 1 ? "" :
                        allImages.length === 3 && index === 0 ? "row-span-2" : ""
                     }`}
                     onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                     }}
                  >
                     <img
                        src={imgUrl}
                        alt={`Post image ${index + 1}`}
                        className="w-full object-cover max-h-96 hover:opacity-90 transition-opacity"
                     />
                     {index === 3 && allImages.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                           <span className="text-white text-2xl font-bold">+{allImages.length - 4}</span>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         )}

         <ImageLightbox
            images={allImages}
            initialIndex={lightboxIndex}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
         />

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
               disabled={isLikeLoading}
            >
               <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""} ${isLikeLoading ? "animate-pulse" : ""}`} />
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
            <Button
               variant="ghost"
               className="flex-1 gap-2 rounded-xl text-gray-600 dark:text-gray-400"
               onClick={onShare}
            >
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
