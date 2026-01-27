import React from "react";

export type ModalType = "delete" | "alert" | "confirm" | "warning";

interface ModalProps {
   isOpen: boolean;
   type?: ModalType;
   title: string;
   message: string;
   onConfirm: () => void;
   onCancel: () => void;
   confirmText?: string;
   cancelText?: string;
   isLoading?: boolean;
}

const buttonStyles = {
   delete: {
      confirm: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300",
      cancel: "px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600",
   },
   warning: {
      confirm: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300",
      cancel: "px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600",
   },
   alert: {
      confirm: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300",
      cancel: "",
   },
   confirm: {
      confirm: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300",
      cancel: "px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600",
   },
};

const LoadingSpinner = () => (
   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
         className="opacity-25"
         cx="12"
         cy="12"
         r="10"
         stroke="currentColor"
         strokeWidth="4"
         fill="none"
      />
      <path
         className="opacity-75"
         fill="currentColor"
         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
   </svg>
);

export const Modal: React.FC<ModalProps> = ({
   isOpen,
   type = "confirm",
   title,
   message,
   onConfirm,
   onCancel,
   confirmText = "Confirm",
   cancelText = "Cancel",
   isLoading = false,
}) => {
   if (!isOpen) return null;

   const styles = buttonStyles[type];
   const showCancel = type !== "alert";

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
               {title}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
               {message}
            </p>

            <div className={`flex gap-2 ${showCancel ? "justify-end" : "justify-center"}`}>
               {showCancel && (
                  <button
                     className={styles.cancel}
                     onClick={onCancel}
                     disabled={isLoading}
                  >
                     {cancelText}
                  </button>
               )}
               <button
                  className={styles.confirm}
                  onClick={onConfirm}
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <span className="flex items-center gap-2">
                        <LoadingSpinner />
                        Loading...
                     </span>
                  ) : (
                     confirmText
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};
