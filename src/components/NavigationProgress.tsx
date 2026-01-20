"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import useLoading from "@/zustand/useLoading";

NProgress.configure({
   showSpinner: false,
   speed: 400,
   minimum: 0.1,
   trickleSpeed: 200,
});

function NavigationProgressInner() {
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const { isLoading } = useLoading();

   useEffect(() => {
      NProgress.done();
   }, [pathname, searchParams]);

   useEffect(() => {
      if (isLoading) {
         NProgress.start();
      } else {
         NProgress.done();
      }
   }, [isLoading]);

   return null;
}

export function NavigationProgress() {
   return (
      <Suspense fallback={null}>
         <NavigationProgressInner />
      </Suspense>
   );
}

export function useNavigationProgress() {
   const start = () => NProgress.start();
   const done = () => NProgress.done();

   return { start, done };
}
