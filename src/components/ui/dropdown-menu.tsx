"use client";

import * as React from "react";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Context for dropdown state
interface DropdownContextType {
   open: boolean;
   setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
   const context = useContext(DropdownContext);
   if (!context) {
      throw new Error("Dropdown components must be used within a DropdownMenu");
   }
   return context;
};

// Main DropdownMenu component
interface DropdownMenuProps {
   children: React.ReactNode;
   open?: boolean;
   onOpenChange?: (open: boolean) => void;
}

const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) => {
   const [internalOpen, setInternalOpen] = useState(false);
   const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

   const setOpen = (newOpen: boolean) => {
      if (controlledOpen === undefined) {
         setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
   };

   return (
      <DropdownContext.Provider value={{ open, setOpen }}>
         <div className="relative inline-block">{children}</div>
      </DropdownContext.Provider>
   );
};

// Trigger component
interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
   ({ className, children, asChild, onClick, ...props }, ref) => {
      const { open, setOpen } = useDropdown();

      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
         e.preventDefault();
         setOpen(!open);
         onClick?.(e);
      };

      if (asChild && React.isValidElement(children)) {
         return React.cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
            ref,
         });
      }

      return (
         <button
            ref={ref}
            type="button"
            className={className}
            onClick={handleClick}
            {...props}
         >
            {children}
         </button>
      );
   }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// Content component
interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
   align?: "start" | "center" | "end";
   sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
   ({ className, align = "end", sideOffset = 4, children, ...props }, ref) => {
      const { open, setOpen } = useDropdown();
      const contentRef = useRef<HTMLDivElement>(null);

      // Close on click outside
      useEffect(() => {
         const handleClickOutside = (event: MouseEvent) => {
            if (contentRef.current && !contentRef.current.parentElement?.contains(event.target as Node)) {
               setOpen(false);
            }
         };

         const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
               setOpen(false);
            }
         };

         if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
         }

         return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
         };
      }, [open, setOpen]);

      if (!open) return null;

      const alignClasses = {
         start: "left-0",
         center: "left-1/2 -translate-x-1/2",
         end: "right-0",
      };

      return (
         <div
            ref={contentRef}
            className={cn(
               "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-gray-900 p-1 text-gray-900 dark:text-gray-100 shadow-md",
               "animate-in fade-in-0 zoom-in-95",
               alignClasses[align],
               className
            )}
            style={{ marginTop: sideOffset }}
            {...props}
         >
            {children}
         </div>
      );
   }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

// Item component
interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
   inset?: boolean;
   disabled?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
   ({ className, inset, disabled, onClick, children, ...props }, ref) => {
      const { setOpen } = useDropdown();

      const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
         if (disabled) return;
         onClick?.(e);
         setOpen(false);
      };

      return (
         <div
            ref={ref}
            className={cn(
               "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
               "hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800",
               inset && "pl-8",
               disabled && "pointer-events-none opacity-50",
               className
            )}
            onClick={handleClick}
            {...props}
         >
            {children}
         </div>
      );
   }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

// Label component
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
   inset?: boolean;
}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
   ({ className, inset, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(
            "px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100",
            inset && "pl-8",
            className
         )}
         {...props}
      />
   )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// Separator component
const DropdownMenuSeparator = React.forwardRef<
   HTMLDivElement,
   React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
   <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-700", className)}
      {...props}
   />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// Shortcut component
const DropdownMenuShortcut = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
   return (
      <span
         className={cn("ml-auto text-xs tracking-widest text-gray-500", className)}
         {...props}
      />
   );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// Group component
const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => {
   return <div>{children}</div>;
};

export {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuGroup,
};
