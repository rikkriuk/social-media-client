import { useState } from "react";
import { Trash2, Loader2, MoreHorizontal, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/helpers/date";
import type { CommentItemProps } from "@/types/comment";

export const CommentItem = ({
   comment,
   currentProfileId,
   baseUrl,
   onDelete,
   onReply,
   onEdit,
   onSubmitEdit,
   onCancelEdit,
   editingComment,
   tDate,
   deleteText,
   editText,
   replyText,
   saveText,
   cancelText,
   isReply = false,
}: CommentItemProps) => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [editContent, setEditContent] = useState("");
   const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

   const name = comment.profile?.name || "User";
   const profileImage = comment.profile?.profileImage
      ? `${baseUrl}/uploads/${comment.profile.profileImage}`
      : undefined;
   const isOwn = currentProfileId === comment.profileId;
   const isEditing = editingComment?.id === comment.id;

   const handleDelete = async () => {
      setIsDeleting(true);
      try {
         await onDelete(comment.id);
      } finally {
         setIsDeleting(false);
      }
   };

   const handleStartEdit = () => {
      setEditContent(comment.content);
      onEdit?.(comment.id);
   };

   const handleSubmitEdit = async () => {
      if (!editContent.trim() || !onSubmitEdit) return;
      setIsSubmittingEdit(true);
      try {
         await onSubmitEdit(comment.id, editContent);
      } finally {
         setIsSubmittingEdit(false);
      }
   };

   const handleCancelEdit = () => {
      setEditContent("");
      onCancelEdit?.();
   };

   return (
      <div>
         <div className={`px-4 py-3 group ${isReply ? "ml-10" : ""}`}>
            <div className="flex gap-3">
               <Avatar className={isReply ? "w-6 h-6" : "w-8 h-8"}>
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
                        {isOwn && !isEditing && (
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
                                 >
                                    {isDeleting ? (
                                       <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                       <MoreHorizontal className="w-4 h-4" />
                                    )}
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                 <DropdownMenuItem
                                    onClick={handleStartEdit}
                                    className="flex gap-2 cursor-pointer"
                                 >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>{editText || "Edit"}</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex gap-2 cursor-pointer text-red-600"
                                 >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{deleteText}</span>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        )}
                     </div>

                     {isEditing ? (
                        <div className="mt-1">
                           <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="resize-none border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
                              rows={2}
                              autoFocus
                           />
                           <div className="flex gap-2 mt-2 justify-end">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-xs h-7 rounded-lg"
                                 onClick={handleCancelEdit}
                                 disabled={isSubmittingEdit}
                              >
                                 {cancelText || "Cancel"}
                              </Button>
                              <Button
                                 size="sm"
                                 className="text-xs h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                 onClick={handleSubmitEdit}
                                 disabled={!editContent.trim() || isSubmittingEdit}
                              >
                                 {isSubmittingEdit ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                 ) : (
                                    saveText || "Save"
                                 )}
                              </Button>
                           </div>
                        </div>
                     ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                           {comment.content}
                        </p>
                     )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-3">
                     <p className="text-xs text-gray-400">
                        {formatRelativeTime(comment.createdAt, tDate)}
                     </p>
                     {!isReply && onReply && replyText && !isEditing && (
                        <button
                           className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
                           onClick={() => onReply(comment.id, name)}
                        >
                           {replyText}
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Render replies */}
         {!isReply && comment.replies && comment.replies.length > 0 && (
            <div>
               {comment.replies.map((reply) => (
                  <CommentItem
                     key={reply.id}
                     comment={reply}
                     currentProfileId={currentProfileId}
                     baseUrl={baseUrl}
                     onDelete={onDelete}
                     onEdit={onEdit}
                     onSubmitEdit={onSubmitEdit}
                     onCancelEdit={onCancelEdit}
                     editingComment={editingComment}
                     tDate={tDate}
                     deleteText={deleteText}
                     editText={editText}
                     saveText={saveText}
                     cancelText={cancelText}
                     isReply
                  />
               ))}
            </div>
         )}
      </div>
   );
};
