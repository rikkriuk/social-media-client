import { useCallback } from "react";
import { toast } from "sonner";

export const useSharePost = (t: (key: string) => string | undefined) => {
   const sharePost = useCallback(async (postId: string) => {
      const url = `${window.location.origin}/post/${postId}`;
      try {
         await navigator.clipboard.writeText(url);
         toast.success(t("linkCopied"));
      } catch {
         const textArea = document.createElement("textarea");
         textArea.value = url;
         textArea.style.position = "fixed";
         textArea.style.opacity = "0";
         document.body.appendChild(textArea);
         textArea.select();
         document.execCommand("copy");
         document.body.removeChild(textArea);
         toast.success(t("linkCopied"));
      }
   }, [t]);

   return { sharePost };
};
