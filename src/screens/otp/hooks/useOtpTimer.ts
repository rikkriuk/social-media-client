import { useEffect, useState } from "react";

const RESEND_DELAY = 10;

export const useOtpTimer = () => {
   const [timeLeft, setTimeLeft] = useState(RESEND_DELAY);
   const [canResend, setCanResend] = useState(false);

   useEffect(() => {
      if (timeLeft === 0) {
         setCanResend(true);
         return;
      }

      const timer = setInterval(() => {
         setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
   }, [timeLeft]);

   const resetTimer = () => {
      setTimeLeft(RESEND_DELAY);
      setCanResend(false);
   };

   return {
      timeLeft,
      canResend,
      resetTimer,
   };
};
