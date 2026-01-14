"use client";

import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/components/ui/utils";
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

      const { userId, otp, requiresVerification } = response.data;

      if (requiresVerification) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("otp", otp);

        toast.success(t("requiresVerification"));
        router.push("/otp");
      }
      
      toast.success(t("resetInformation"));
      router.push("/login")
    } catch (err: unknown) {
      const error = err as ApiError;

      toast.error(error?.data?.message || t("invalidCode"));
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (loading) return false;
    return email.trim() !== "";
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
            <FormItem
              label={t("email")}
              name="email"
              required
            >
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={t("emailPlaceholder")} 
                className="mt-1 rounded-xl" 
              />
            </FormItem>

            <Button 
              type="submit" 
              disabled={!isFormValid()}
              className={cn(
                "w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white" ,
                (loading || !isFormValid()) && "opacity-70 cursor-not-allowed"
              )}
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
