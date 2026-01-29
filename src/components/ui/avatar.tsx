"use client";

import * as React from "react";
import { cn } from "./utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
   children?: React.ReactNode;
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
   children?: React.ReactNode;
}

const Avatar = ({ className, children, ...props }: AvatarProps) => {
   return (
      <div
         data-slot="avatar"
         className={cn(
         "relative flex size-10 shrink-0 overflow-hidden rounded-full",
         className,
         )}
         {...props}
      >
         {children}
      </div>
   );
}

const AvatarImage = ({
  className,
  onLoadingStatusChange,
  ...props
}: AvatarImageProps) => {
   const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
      "loading"
   );

   const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      onLoadingStatusChange?.("loaded");
      props.onLoad?.(e as React.SyntheticEvent<HTMLImageElement, Event>);
   };

   const handleError = () => {
      setStatus("error");
      onLoadingStatusChange?.("error");
      props.onError?.("error" as unknown as React.SyntheticEvent<HTMLImageElement, Event>);
   };

   if (status === "error") return null;

   return (
      <img
         data-slot="avatar-image"
         className={cn("aspect-square size-full object-cover", className)}
         style={status === "loading" ? { display: "none" } : undefined}
         onLoad={handleLoad}
         onError={handleError}
         {...props}
      />
   );
}

const AvatarFallback = ({
   className,
   children,
   ...props
}: AvatarFallbackProps) => {
   return (
      <div
         data-slot="avatar-fallback"
         className={cn(
         "bg-gray-200 dark:bg-gray-700 flex size-full items-center justify-center rounded-full text-sm font-medium text-gray-700 dark:text-gray-300",
         className,
         )}
         {...props}
      >
         {children}
      </div>
   );
}

export { Avatar, AvatarImage, AvatarFallback };
