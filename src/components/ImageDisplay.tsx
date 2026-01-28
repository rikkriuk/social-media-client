"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageDisplayProps {
   src: string;
   alt?: string;
   className?: string;
   fallbackClassName?: string;
   onError?: () => void;
}

export function ImageDisplay({
   src,
   alt = "Image",
   className = "w-full h-auto",
   fallbackClassName = "w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded",
   onError,
}: ImageDisplayProps) {
   const [hasError, setHasError] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   if (!src || hasError) {
      return (
         <div className={fallbackClassName}>
            <ImageOff className="w-8 h-8 text-gray-400" />
         </div>
      );
   }

   return (
      <div className="relative">
         {isLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
         )}
         <img
            src={src}
            alt={alt}
            className={className}
            onLoad={() => setIsLoading(false)}
            onError={() => {
               setHasError(true);
               setIsLoading(false);
               onError?.();
            }}
         />
      </div>
   );
}
