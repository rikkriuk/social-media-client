import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/helpers/date";
import type { Comment } from "@/types/comment";

interface CommentItemProps {
   comment: Comment;
   currentProfileId: string | null;
   baseUrl: string;
   onDelete: (commentId: string) => Promise<void>;
   tDate: (key: string) => string | undefined;
   deleteText: string;
}

export const CommentItem = ({
   comment,
   currentProfileId,
   baseUrl,
   onDelete,
   tDate,
   deleteText,
}: CommentItemProps) => {
   const [isDeleting, setIsDeleting] = useState(false);

   const name = comment.profile?.name || "User";
   const profileImage = comment.profile?.profileImage
      ? `${baseUrl}/uploads/${comment.profile.profileImage}`
      : undefined;
   const isOwn = currentProfileId === comment.profileId;

   const handleDelete = async () => {
      setIsDeleting(true);
      try {
         await onDelete(comment.id);
      } finally {
         setIsDeleting(false);
      }
   };

   return (
      <div className="px-4 py-3 group">
         <div className="flex gap-3">
            <Avatar className="w-8 h-8">
               <AvatarImage src={profileImage} alt={name} />
               <AvatarFallback className="text-xs">
                  {name.charAt(0).toUpperCase()}
               </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
               <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                     <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {name}
                     </p>
                     {isOwn && (
                        <Button
                           variant="ghost"
                           size="icon"
                           className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                           onClick={handleDelete}
                           disabled={isDeleting}
                           title={deleteText}
                        >
                           {isDeleting ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                           ) : (
                              <Trash2 className="w-3 h-3" />
                           )}
                        </Button>
                     )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                     {comment.content}
                  </p>
               </div>
               <p className="text-xs text-gray-400 mt-1 ml-3">
                  {formatRelativeTime(comment.createdAt, tDate)}
               </p>
            </div>
         </div>
      </div>
   );
};
