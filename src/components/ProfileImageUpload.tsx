"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { ImageDisplay } from "./ImageDisplay";
import { Modal } from "./Modal";
import { toast } from "sonner";
import { useTranslationCustom } from "@/i18n/client";
import useLanguage from "@/zustand/useLanguage";

interface ProfileImageUploadProps {
   currentImageUrl?: string | null;
   onImageUploadSuccess?: (imageUrl: string) => void;
   avatarFallback?: string;
}

export function ProfileImageUpload({
   currentImageUrl,
   onImageUploadSuccess,
   avatarFallback = "U",
}: ProfileImageUploadProps) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "profile");

   const handleUploadSuccess = (fileUrl: string) => {
      toast.success(t("imageUpdated"));
      onImageUploadSuccess?.(fileUrl);
      setIsModalOpen(false);
   };

   return (
      <>
         <div className="relative inline-block">
            {currentImageUrl ? (
               <ImageDisplay
                  src={currentImageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                  fallbackClassName="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold"
               />
            ) : (
               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {avatarFallback}
               </div>
            )}

            <button
               onClick={() => setIsModalOpen(true)}
               className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors shadow-lg"
               title={t("changeImage")}
            >
               <Camera className="w-4 h-4" />
            </button>
         </div>

         <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={t("changeProfileImage")}
         >
            <div className="p-4">
               <ImageUpload
                  onUploadSuccess={handleUploadSuccess}
                  maxSize={10}
                  accept="image/*"
                  uploadEndpoint="image"
               />
            </div>
         </Modal>
      </>
   );
}
