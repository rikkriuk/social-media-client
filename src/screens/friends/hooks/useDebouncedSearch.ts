import { useEffect, useCallback } from "react";

interface UseDebounceSearchProps {
  query: string;
  callback: (query: string) => void;
  delay?: number;
}

export const useDebouncedSearch = ({
  query,
  callback,
  delay = 300,
}: UseDebounceSearchProps) => {
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
