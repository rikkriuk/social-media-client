"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogPortal, DialogOverlay } from "./ui/dialog";

interface ImageLightboxProps {
   images: string[];
   initialIndex?: number;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({
   images,
   initialIndex = 0,
   open,
   onOpenChange,
}: ImageLightboxProps) {
   const [currentIndex, setCurrentIndex] = useState(initialIndex);

   useEffect(() => {
      if (open) setCurrentIndex(initialIndex);
   }, [open, initialIndex]);

   const goNext = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
   }, [images.length]);

   const goPrev = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
   }, [images.length]);

   useEffect(() => {
      if (!open) return;

      function handleKeyDown(e: KeyboardEvent) {
         if (e.key === "ArrowRight") goNext();
         else if (e.key === "ArrowLeft") goPrev();
         else if (e.key === "Escape") onOpenChange(false);
      }

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
   }, [open, goNext, goPrev, onOpenChange]);

   if (images.length === 0) return null;

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogPortal>
            <DialogOverlay className="bg-black/90" />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <button
                  onClick={() => onOpenChange(false)}
                  className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors cursor-pointer"
               >
                  <X className="w-6 h-6" />
               </button>

               {images.length > 1 && (
                  <button
                     onClick={goPrev}
                     className="absolute left-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors cursor-pointer"
                  >
                     <ChevronLeft className="w-8 h-8" />
                  </button>
               )}

               <img
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  className="max-h-[90vh] max-w-[90vw] object-contain select-none"
                  onClick={(e) => e.stopPropagation()}
               />

               {images.length > 1 && (
                  <button
                     onClick={goNext}
                     className="absolute right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors cursor-pointer"
                  >
                     <ChevronRight className="w-8 h-8" />
                  </button>
               )}

               {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                     {images.map((_, index) => (
                        <button
                           key={index}
                           onClick={() => setCurrentIndex(index)}
                           className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                              index === currentIndex
                                 ? "bg-white"
                                 : "bg-white/40 hover:bg-white/60"
                           }`}
                        />
                     ))}
                  </div>
               )}
            </div>
         </DialogPortal>
      </Dialog>
   );
}
