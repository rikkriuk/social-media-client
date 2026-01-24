import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import OtpInputs from "@/components/OtpInputs";
import { OtpFormProps } from "@/types/auth";

export const OtpForm = ({
   code,
   onChange,
   onSubmit,
   loading,
   tFunc,
}: OtpFormProps) => {
   return (
      <form onSubmit={onSubmit} className="space-y-4">
         <div>
         <Label htmlFor="code">{tFunc("enterOtp")}</Label>

         <div className="mt-2">
            <OtpInputs
               length={6}
               value={code}
               onChange={onChange}
            />
         </div>
         </div>

         <Button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading || code.length !== 6}
         >
            {loading ? tFunc("verifyButton") + "..." : tFunc("verifyButton")}
         </Button>
      </form>
   );
};
