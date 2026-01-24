interface ResendSectionProps {
   canResend: boolean;
   timeLeft: number;
   resending: boolean;
   onResend: () => void;
   tFunc: (key: string, options?: any) => string;
}

export const ResendSection = ({
   canResend,
   timeLeft,
   resending,
   onResend,
   tFunc,
}: ResendSectionProps) => {
   if (!canResend) {
      return (
         <p className="text-sm text-center text-gray-600 dark:text-gray-400">
         {tFunc("resendIn", {
            min: Math.floor(timeLeft / 60),
            sec: String(timeLeft % 60).padStart(2, "0"),
         })}
         </p>
      );
   }

   return (
      <p className="text-sm text-center">
         <button
            type="button"
            onClick={onResend}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
            disabled={resending}
         >
            {resending ? tFunc("resend") + "..." : tFunc("resend")}
         </button>
      </p>
   );
};
