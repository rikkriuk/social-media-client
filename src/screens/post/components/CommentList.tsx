import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";
import type { Comment } from "@/types/comment";

interface CommentListProps {
   comments: Comment[];
   currentProfileId: string | null;
   baseUrl: string;
   hasMore: boolean;
   isLoadingMore: boolean;
   onLoadMore: () => void;
   onDelete: (commentId: string) => Promise<void>;
   tDate: (key: string) => string | undefined;
   emptyText: string;
   loadMoreText: string;
   deleteText: string;
}

export const CommentList = ({
   comments,
   currentProfileId,
   baseUrl,
   hasMore,
   isLoadingMore,
   onLoadMore,
   onDelete,
   tDate,
   emptyText,
   loadMoreText,
   deleteText,
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
                  tDate={tDate}
                  deleteText={deleteText}
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
