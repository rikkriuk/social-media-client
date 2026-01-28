"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

interface ProgressLinkProps extends LinkProps {
   children: ReactNode;
   className?: string;
   onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function ProgressLink({ href, children, className, onClick, ...props }: ProgressLinkProps) {
   return (
      <Link href={href} className={className} onClick={onClick} {...props}>
         {children}
      </Link>
   );
}

export function useProgressRouter() {
   const router = useRouter();

   const push = (href: string) => {
      router.push(href);
   };

   const replace = (href: string) => {
      router.replace(href);
   };

   const back = () => {
      router.back();
   };

   const refresh = () => {
      router.refresh();
   };

   return { push, replace, back, refresh };
}
