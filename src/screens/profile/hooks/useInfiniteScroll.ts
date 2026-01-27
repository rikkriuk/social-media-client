import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UseInfiniteScrollProps, UseInfiniteScrollReturn } from "@/types/profile";

export const useInfiniteScroll = ({
   items,
   totalItems,
   itemsPerPage = 5,
}: UseInfiniteScrollProps): UseInfiniteScrollReturn => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const currentPage = parseInt(searchParams.get("page") || "1", 10);

   const [displayItems, setDisplayItems] = useState(items);
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const endRef = useRef<HTMLDivElement>(null);
   const observerRef = useRef<IntersectionObserver | null>(null);
   const currentPageRef = useRef<number>(currentPage);
   const isLoadingRef = useRef<boolean>(false);
   const pendingPageRef = useRef<number | null>(null);

   // Update current page ref and sync display items
   useEffect(() => {
      currentPageRef.current = currentPage;

      if (currentPage === 1 || items.length > displayItems.length) {
         setDisplayItems(items);
      }

      if (pendingPageRef.current === currentPage || currentPage === 1) {
         isLoadingRef.current = false;
         pendingPageRef.current = null;
         setIsLoadingMore(false);
      }
   }, [items, currentPage, displayItems.length]);

   const loadedItemsCount = displayItems.length;
   const hasMoreItems = loadedItemsCount < totalItems;

   const loadMoreItems = useCallback(async () => {
      if (isLoadingRef.current) {
         return;
      }

      const nextPage = currentPageRef.current + 1;

      isLoadingRef.current = true;
      pendingPageRef.current = nextPage;
      setIsLoadingMore(true);

      try {
         await router.push(`?page=${nextPage}`, { scroll: false });
      } catch {
         isLoadingRef.current = false;
         pendingPageRef.current = null;
         setIsLoadingMore(false);
      }
   }, [router]);

   // Infinite scroll observer
   useEffect(() => {
      if (!hasMoreItems || isLoadingMore) {
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
         return;
      }

      if (observerRef.current) {
         observerRef.current.disconnect();
      }

      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting && !isLoadingRef.current) {
               loadMoreItems();
            }
         },
         { threshold: 0.1 }
      );

      if (endRef.current) {
         observer.observe(endRef.current);
         observerRef.current = observer;
      }

      return () => {
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      };
   }, [hasMoreItems, isLoadingMore, loadMoreItems]);

   return {
      displayItems,
      isLoadingMore,
      endRef,
      hasMoreItems,
   };
};
