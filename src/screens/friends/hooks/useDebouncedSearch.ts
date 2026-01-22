import type { UseDebouncedSearchProps } from "@/types/friend";
import { useEffect } from "react";

export const useDebouncedSearch = ({
   query,
   callback,
   delay = 300,
}: UseDebouncedSearchProps) => {
   useEffect(() => {
      if (!query.trim()) {
         callback("");
         return;
      }

      const timer = setTimeout(() => {
         callback(query);
      }, delay);

      return () => clearTimeout(timer);
   }, [query, callback, delay]);
};
