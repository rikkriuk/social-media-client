import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import useNavigation from "@/zustand/useNavigation";

export async function navigateTo(
   router: AppRouterInstance,
   href: string
) {
   try {
      useNavigation.getState().setIsNavigating(true);
      router.push(href);
      setTimeout(() => {
         useNavigation.getState().setIsNavigating(false);
      }, 1000);
   } catch (error) {
      useNavigation.getState().setIsNavigating(false);
      throw error;
   }
}

export async function replaceTo(
   router: AppRouterInstance,
   href: string
) {
   try {
      useNavigation.getState().setIsNavigating(true);
      router.replace(href);
      setTimeout(() => {
         useNavigation.getState().setIsNavigating(false);
      }, 1000);
   } catch (error) {
      useNavigation.getState().setIsNavigating(false);
      throw error;
   }
}
