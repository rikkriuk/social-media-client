import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
   variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
   ({ className, variant = "default", ...props }, ref) => {
      const variantClasses = {
         default: "bg-blue-600 text-white hover:bg-blue-700",
         secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
         destructive: "bg-red-600 text-white hover:bg-red-700",
         outline: "border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100",
         success: "bg-green-600 text-white hover:bg-green-700",
         warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      };

      return (
         <div
            ref={ref}
            className={cn(
               "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
               variantClasses[variant],
               className
            )}
            {...props}
         />
      );
   }
);

Badge.displayName = "Badge";

export { Badge };
