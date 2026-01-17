"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

interface DialogContextType {
   open: boolean;
   setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

function useDialog() {
   const context = React.useContext(DialogContext);
   if (!context) {
      throw new Error("Dialog components must be used within a Dialog");
   }
   return context;
}

interface DialogProps {
   open?: boolean;
   onOpenChange?: (open: boolean) => void;
   children: React.ReactNode;
}

function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
   const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

   const isControlled = controlledOpen !== undefined;
   const open = isControlled ? controlledOpen : uncontrolledOpen;

   const setOpen = (newOpen: boolean) => {
      if (isControlled) {
         onOpenChange?.(newOpen);
      } else {
         setUncontrolledOpen(newOpen);
      }
   };

   React.useEffect(() => {
      if (open) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }

      return () => {
         document.body.style.overflow = "unset";
      };
   }, [open]);

   return (
      <DialogContext.Provider value={{ open, setOpen }}>
         {children}
      </DialogContext.Provider>
   );
}

function DialogTrigger({
   children,
   className,
   asChild,
   ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
   const { setOpen } = useDialog();

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
         onClick: (e: React.MouseEvent) => {
         (children.props as any).onClick?.(e);
         setOpen(true);
         },
      } as any);
   }

   return (
      <button
         data-slot="dialog-trigger"
         onClick={() => setOpen(true)}
         className={className}
         {...props}
      >
         {children}
      </button>
   );
}

function DialogPortal({ children }: { children: React.ReactNode }) {
   const { open } = useDialog();

   if (!open) return null;

   return <>{children}</>;
}

function DialogClose({
   className,
   ...props
}: React.ComponentProps<"button">) {
   const { setOpen } = useDialog();

   return (
      <button
         data-slot="dialog-close"
         onClick={() => setOpen(false)}
         className={className}
         {...props}
      />
   );
}

function DialogOverlay({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const { setOpen } = useDialog();

   return (
      <div
         data-slot="dialog-overlay"
         onClick={() => setOpen(false)}
         className={cn(
            "animate-in fade-in-0 fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
            className
         )}
         {...props}
      />
   );
}

function DialogContent({
   className,
   children,
   ...props
}: React.ComponentProps<"div">) {
   const { setOpen } = useDialog();

   React.useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
         if (e.key === "Escape") {
         setOpen(false);
         }
      }

      document.addEventListener("keydown", handleKeyDown);
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [setOpen]);

   return (
      <DialogPortal>
         <DialogOverlay />
            <div
               data-slot="dialog-content"
               className={cn(
                  "animate-in fade-in-0 zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 sm:max-w-lg",
                  className
               )}
               {...props}
            >
            {children}
            <DialogClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
               <XIcon />
               <span className="sr-only">Close</span>
            </DialogClose>
         </div>
      </DialogPortal>
   );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         data-slot="dialog-header"
         className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
         {...props}
      />
   );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         data-slot="dialog-footer"
         className={cn(
         "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
         className
      )}
         {...props}
      />
   );
}

function DialogTitle({
   className,
   ...props
}: React.ComponentProps<"h2">) {
   return (
      <h2
         data-slot="dialog-title"
         className={cn("text-lg leading-none font-semibold", className)}
         {...props}
      />
   );
}

function DialogDescription({
   className,
   ...props
}: React.ComponentProps<"p">) {
   return (
      <p
         data-slot="dialog-description"
         className={cn("text-muted-foreground text-sm", className)}
         {...props}
      />
   );
}

export {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogOverlay,
   DialogPortal,
   DialogTitle,
   DialogTrigger,
};
