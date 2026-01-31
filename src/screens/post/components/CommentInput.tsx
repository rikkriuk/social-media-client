import { Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentInputProps } from "@/types/comment";

export const CommentInput = ({
   value,
   onChange,
   onSubmit,
   isSending,
   placeholder,
   replyTarget,
   onCancelReply,
}: CommentInputProps) => {
   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         if (value.trim() && !isSending) {
            onSubmit();
         }
      }
   };

   return (
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
         {replyTarget && (
            <div className="flex items-center justify-between mb-2 px-1">
               <p className="text-xs text-blue-600 dark:text-blue-400">
                  Membalas <span className="font-semibold">@{replyTarget.profileName}</span>
               </p>
               <button
                  onClick={onCancelReply}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>
         )}
         <div className="flex gap-3">
            <Textarea
               placeholder={placeholder}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               onKeyDown={handleKeyDown}
               className="flex-1 resize-none border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800"
               rows={2}
            />
            <Button
               size="icon"
               className="rounded-full bg-blue-600 hover:bg-blue-700 text-white self-end"
               onClick={onSubmit}
               disabled={!value.trim() || isSending}
            >
               {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
               ) : (
                  <Send className="w-4 h-4" />
               )}
            </Button>
         </div>
      </div>
   );
};
