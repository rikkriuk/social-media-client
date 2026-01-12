import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "./utils";
import { useEffect, useState } from "react";

const Toast = ({ status, message, duration= 5000 }: { status: string; message: string; duration?: number }) => {
   const [closing, setClosing] = useState(false);
   const [visible, setVisible] = useState(true);

   useEffect(() => {
      const closeTimer = setTimeout(() => {
         setClosing(true);
      }, duration);

      const unmountTimer = setTimeout(() => {
         setVisible(false);
      }, duration + 250);

      return () => {
         clearTimeout(closeTimer);
         clearTimeout(unmountTimer);
      };
   }, [duration]);

   if (!visible) return null;

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "success":
            return CheckCircle;
         case "error":
            return AlertCircle;
         case "info":
            return Info;
         default:
            return Info;
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "success":
            return "bg-green-600";
         case "error":
            return "bg-red-600";
         case "info":
            return "bg-blue-600";
         default:
            return "bg-gray-600";
      }
   };

   const IconComponent = getStatusIcon(status);

   return (
      <div 
         className={cn(`
            absolute flex items-center top-0 ${getStatusColor(status)} py-2 px-4 rounded-md shadow-lg toast-enter`,
            closing ? "toast-exit" : "toast-enter"
         )}
      >
         <IconComponent className="inline mr-2 font-semibold text-white" size={16} />
         <p className="text-white font-semibold">{message}</p>
      </div>
   )
}

export default Toast;