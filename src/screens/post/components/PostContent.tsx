import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageLightbox } from "@/components/ImageLightbox";
import { formatRelativeTime } from "@/helpers/date";
import { PostContentProps } from "@/types/comment";

export const PostContent = ({
   post,
   baseUrl,
   likesCount,
   isLiked,
   commentsCount,
   onLikeToggle,
   onShare,
   tDate,
}: PostContentProps) => {
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [lightboxIndex, setLightboxIndex] = useState(0);

   const profileName = post.profile?.name || "User";
   const profileImage = post.profile?.profileImage
      ? `${baseUrl}/uploads/${post.profile.profileImage}`
      : undefined;
   const mediaIds = Array.isArray(post.mediaIds) ? post.mediaIds : [];
   const imageUrls = mediaIds.map((filename) => `${baseUrl}/uploads/${filename}`);

   const openLightbox = (index: number) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
   };

   return (
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
         <div className="px-4 py-4">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
               <Avatar>
                  <AvatarImage src={profileImage} alt={profileName} />
                  <AvatarFallback>
                     {profileName.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{profileName}</p>
                  <p className="text-sm text-gray-500">
                     {formatRelativeTime(post.createdAt, tDate)}
                  </p>
               </div>
            </div>

            {/* Content */}
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap mb-4">
               {post.content}
            </p>

            {/* Images */}
            {mediaIds.length > 0 && (
               <div className={`mb-4 ${mediaIds.length === 1 ? "" : "grid grid-cols-2 gap-1"} rounded-xl overflow-hidden`}>
                  {mediaIds.map((filename, index) => (
                     <img
                        key={index}
                        src={`${baseUrl}/uploads/${filename}`}
                        alt={`Post image ${index + 1}`}
                        className="w-full object-cover max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(index)}
                     />
                  ))}
               </div>
            )}

            <ImageLightbox
               images={imageUrls}
               initialIndex={lightboxIndex}
               open={lightboxOpen}
               onOpenChange={setLightboxOpen}
            />

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-800">
               <button
                  onClick={onLikeToggle}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
               >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="text-sm">{likesCount}</span>
               </button>
               <div className="flex items-center gap-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{commentsCount}</span>
               </div>
               <button
                  onClick={onShare}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
               >
                  <Share2 className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
   );
};
