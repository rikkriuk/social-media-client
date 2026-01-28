"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { webRequest } from "@/helpers/api";

interface ImageUploadProps {
   onUploadSuccess?: (fileUrl: string, filename: string) => void;
   onUploadError?: (error: string) => void;
   maxSize?: number; // in MB
   accept?: string;
   uploadEndpoint?: "image" | "video";
}

export function ImageUpload({
   onUploadSuccess,
   onUploadError,
   maxSize = 10,
   accept = "image/*",
   uploadEndpoint = "image",
}: ImageUploadProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [isDragActive, setIsDragActive] = useState(false);
   const [preview, setPreview] = useState<string | null>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleFile = (file: File) => {
      const maxBytes = maxSize * 1024 * 1024;

      // Validate file size
      if (file.size > maxBytes) {
         const errorMsg = `File size exceeds ${maxSize}MB limit`;
         toast.error(errorMsg);
         onUploadError?.(errorMsg);
         return;
      }

      // Validate file type
      if (!file.type.startsWith(accept.replace("/*", ""))) {
         const errorMsg = `Invalid file type. Allowed: ${accept}`;
         toast.error(errorMsg);
         onUploadError?.(errorMsg);
         return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
         setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
   };

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         handleFile(e.target.files[0]);
      }
   };

   const handleDrag = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
         setIsDragActive(true);
      } else if (e.type === "dragleave") {
         setIsDragActive(false);
      }
   };

   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         handleFile(e.dataTransfer.files[0]);
      }
   };

   const handleUpload = async () => {
      if (!selectedFile) return;

      setIsLoading(true);
      try {
         const formData = new FormData();
         formData.append("file", selectedFile);

         const response = await webRequest.post(`/upload/${uploadEndpoint}`, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         const { data } = response.data;
         toast.success(`${uploadEndpoint.charAt(0).toUpperCase() + uploadEndpoint.slice(1)} uploaded successfully`);
         onUploadSuccess?.(data.url, data.filename);

         // Reset
         setSelectedFile(null);
         setPreview(null);
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      } catch (error: any) {
         const errorMsg = error.response?.data?.message || `Failed to upload ${uploadEndpoint}`;
         toast.error(errorMsg);
         onUploadError?.(errorMsg);
      } finally {
         setIsLoading(false);
      }
   };

   const handleRemove = () => {
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   return (
      <div className="w-full">
         {!preview ? (
            <div
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current?.click()}
               className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
                  isDragActive
                     ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                     : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500"
               }`}
            >
               <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Drag and drop or click to select
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                     Max size: {maxSize}MB
                  </p>
               </div>
               <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  onChange={handleChange}
                  className="hidden"
               />
            </div>
         ) : (
            <div className="relative">
               {uploadEndpoint === "image" ? (
                  <img
                     src={preview}
                     alt="Preview"
                     className="w-full h-auto rounded-lg object-cover max-h-96"
                  />
               ) : (
                  <video
                     src={preview}
                     controls
                     className="w-full h-auto rounded-lg max-h-96"
                  />
               )}
               <button
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-full p-2 transition-colors"
               >
                  <X className="w-5 h-5" />
               </button>
               <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
               >
                  {isLoading ? "Uploading..." : "Upload"}
               </button>
            </div>
         )}
      </div>
   );
}
