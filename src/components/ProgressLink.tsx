"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { ReactNode, MouseEvent } from "react";

interface ProgressLinkProps extends LinkProps {
   children: ReactNode;
   className?: string;
   onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function ProgressLink({ href, children, className, onClick, ...props }: ProgressLinkProps) {
   const router = useRouter();

   const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
         onClick(e);
      }

      const targetUrl = typeof href === "string" ? href : href.pathname || "";
      const isExternal = targetUrl.startsWith("http") || targetUrl.startsWith("//");
      const isSamePage = targetUrl.startsWith("#");

      if (!isExternal && !isSamePage && !e.defaultPrevented) {
         NProgress.start();
      }
   };

   return (
      <Link href={href} className={className} onClick={handleClick} {...props}>
         {children}
      </Link>
   );
}

export function useProgressRouter() {
   const router = useRouter();

   const push = (href: string) => {
      NProgress.start();
      router.push(href);
   };

   const replace = (href: string) => {
      NProgress.start();
      router.replace(href);
   };

   const back = () => {
      NProgress.start();
      router.back();
   };

   const refresh = () => {
      NProgress.start();
      router.refresh();
   };

   return { push, replace, back, refresh };
}
