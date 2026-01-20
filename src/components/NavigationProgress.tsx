"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
   showSpinner: false,
   speed: 400,
   minimum: 0.1,
   trickleSpeed: 200,
});

function NavigationProgressInner() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      NProgress.done();
   }, [pathname, searchParams]);

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
