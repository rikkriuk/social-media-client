import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";
import type { CommentListProps } from "@/types/comment";

export const CommentList = ({
   comments,
   currentProfileId,
   baseUrl,
   hasMore,
   isLoadingMore,
   onLoadMore,
   onDelete,
   onReply,
   onEdit,
   onSubmitEdit,
   onCancelEdit,
   editingComment,
   tDate,
   emptyText,
   loadMoreText,
   deleteText,
   editText,
   replyText,
   saveText,
   cancelText,
}: CommentListProps) => {
   if (comments.length === 0) {
      return (
         <div className="px-4 py-8 text-center">
            <p className="text-gray-500 text-sm">{emptyText}</p>
         </div>
      );
   }

   return (
      <div>
         <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {comments.map((comment) => (
               <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentProfileId={currentProfileId}
                  baseUrl={baseUrl}
                  onDelete={onDelete}
                  onReply={onReply}
                  onEdit={onEdit}
                  onSubmitEdit={onSubmitEdit}
                  onCancelEdit={onCancelEdit}
                  editingComment={editingComment}
                  tDate={tDate}
                  deleteText={deleteText}
                  editText={editText}
                  replyText={replyText}
                  saveText={saveText}
                  cancelText={cancelText}
               />
            ))}
         </div>

         {hasMore && (
            <div className="px-4 py-3 text-center">
               <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 rounded-xl"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
               >
                  {isLoadingMore ? (
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {loadMoreText}
               </Button>
            </div>
         )}
      </div>
   );
};
