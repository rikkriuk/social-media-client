"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WebSample from "@/components/ui/web-sample";
import { webRequest } from "@/helpers/api";
import { useTranslationCustom } from "@/i18n/client";
import { ApiError } from "@/types/api";
import useLanguage from "@/zustand/useLanguage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "forgot");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await webRequest.post("/auth/submit", {
        type: "forgot-password",
        email,
      });

      const { userId, otp } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("otp", otp);
      
      toast.success(t("otpSent"));
      router.push("/otp")
    } catch (err: unknown) {
      const error = err as ApiError;

      toast.error(error?.data?.message || t("invalidCode"));
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <WebSample
          title={t("resetPassword")}
          description={t("enterEmail")}
        />

        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8"
        >
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div>
              <Label 
                htmlFor="email"
              >
                {t("email")}
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={t("emailPlaceholder")} 
                className="mt-1 rounded-xl" 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={loading}
            >
              {loading ? t("sendOtp") + "..." : t("sendOtp")}
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
