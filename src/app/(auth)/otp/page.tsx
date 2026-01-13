"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslationCustom } from "@/i18n/client";
import useLanguage from "@/zustand/useLanguage";
import { useEffect, useState } from "react";
import OtpInputs from "@/components/OtpInputs";
import WebSample from "@/components/ui/web-sample";
import { initialOtp } from "@/types/auth";
import { toast } from "sonner";
import { ApiError } from "@/types/api";
import { webRequest } from "@/helpers/api";

export default function OtpPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "otp");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialOtp)

  useEffect(() => {
    const code = localStorage.getItem("otp") || "";
    const userId = localStorage.getItem("userId") || "";
    setData((prev) => ({
      ...prev,
      userId,
      code,
    }));

    // localStorage.removeItem("otp");
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await webRequest.post("/auth/submit", {
        type: "otp",
        data,
      });

      toast.success(t("otpVerified"));
      window.location.href = "/login";
    } catch (err: unknown) {
      const error = err as ApiError;
      
      toast.error(error.data?.message || t("invalidCode"));
      console.error("OTP verify error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <WebSample
          title={t("verifyOtp")}
          description={t("enterOtp")}
        />

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label 
                htmlFor="code">{t("enterOtp")}
              </Label>

              <div className="mt-2">
                <OtpInputs 
                  length={6} 
                  value={data.code} 
                  onChange={(v) => setData((prev) => ({
                    ...prev,
                    code: v
                  }))} 
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || data.code.length !== 6}>
              {loading ? t("verifyButton") + "..." : t("verifyButton")}
            </Button>
          </form>

          <p className="text-center mt-4">
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("backToLogin")}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
