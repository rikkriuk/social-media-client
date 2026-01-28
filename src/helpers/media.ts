import { webRequest } from './api';

const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Generate full media URL from filename or relative path
 */
export function getMediaUrl(filename: string | null | undefined): string | null {
   if (!filename) return null;
   
   // If it's already a full URL, return as is
   if (filename.startsWith('http')) {
      return filename;
   }
   
   // If it's a relative path, prepend base URL
   if (filename.startsWith('/')) {
      return `${UPLOAD_BASE_URL}${filename}`;
   }
   
   // Otherwise assume it's a filename
   return `${UPLOAD_BASE_URL}/uploads/${filename}`;
}

/**
 * Upload image to backend
 */
export async function uploadImage(file: File) {
   const formData = new FormData();
   formData.append('file', file);

   try {
      const response = await webRequest.post('/upload/image', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });

      return response.data.data;
   } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
   }
}

/**
 * Upload video to backend
 */
export async function uploadVideo(file: File) {
   const formData = new FormData();
   formData.append('file', file);

   try {
      const response = await webRequest.post('/upload/video', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });

      return response.data.data;
   } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload video');
   }
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
   file: File,
   minWidth?: number,
   minHeight?: number,
   maxWidth?: number,
   maxHeight?: number
): Promise<boolean> {
   return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
            const { width, height } = img;
            
            if (minWidth && width < minWidth) return resolve(false);
            if (minHeight && height < minHeight) return resolve(false);
            if (maxWidth && width > maxWidth) return resolve(false);
            if (maxHeight && height > maxHeight) return resolve(false);
            
            resolve(true);
         };
         img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
   });
}

/**
 * Compress image before upload
 */
export async function compressImage(
   file: File,
   maxWidth: number = 1920,
   maxHeight: number = 1080,
   quality: number = 0.8
): Promise<File> {
   return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
               if (width > maxWidth) {
                  height *= maxWidth / width;
                  width = maxWidth;
               }
            } else {
               if (height > maxHeight) {
                  width *= maxHeight / height;
                  height = maxHeight;
               }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
               (blob) => {
                  const compressedFile = new File([blob!], file.name, {
                     type: 'image/jpeg',
                     lastModified: Date.now(),
                  });
                  resolve(compressedFile);
               },
               'image/jpeg',
               quality
            );
         };
         img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
   });
}
