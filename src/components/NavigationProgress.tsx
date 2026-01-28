"use client";

import { useTransition, useEffect } from "react";
import NProgress from "nprogress";
import useLoading from "@/zustand/useLoading";
import useNavigation from "@/zustand/useNavigation";

NProgress.configure({
   showSpinner: false,
   speed: 400,
   minimum: 0.1,
   trickleSpeed: 200,
});

export function NavigationProgress() {
   const [isPending] = useTransition();
   const { isLoading } = useLoading();
   const { isNavigating } = useNavigation();
   const isProcessing = isPending || isLoading || isNavigating;

   useEffect(() => {
      if (isProcessing) {
         NProgress.start();
      } else {
         NProgress.done();
      }
   }, [isProcessing]);

   return null;
}

export function useNavigationProgress() {
   const start = () => NProgress.start();
   const done = () => NProgress.done();

   return { start, done };
}
