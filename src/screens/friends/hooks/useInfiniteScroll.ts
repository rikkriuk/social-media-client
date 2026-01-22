import { useEffect, useRef } from "react";
import type { UseInfiniteScrollProps } from "@/types/friend";

export const useInfiniteScroll = ({
   callback,
   hasMore,
   isLoading,
   isActive,
}: UseInfiniteScrollProps) => {
  const endRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!isActive) return;

      const observer = new IntersectionObserver(
         (entries) => {
         if (entries[0].isIntersecting && hasMore && !isLoading) {
            callback();
         }
         },
         { threshold: 0.1 }
      );

      if (endRef.current) {
         observer.observe(endRef.current);
      }

      return () => observer.disconnect();
   }, [isActive, hasMore, isLoading, callback]);

   return endRef;
};
