"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormItem } from "./ui/form-item";
import { PasswordInput } from "./ui/password-input";
import { useRouter } from "next/navigation";
import { AuthProps, initialAuth } from "@/types/auth";
import { useState } from "react";
import { cn } from "./ui/utils";
import WebSample from "./ui/web-sample";
import { ValidationResult } from "@/helpers/validation";

const Auth = ({ isRegister, loading, onSubmit, t }: AuthProps) => {
   const router = useRouter()

   const [data, setData] = useState(initialAuth);
   const [isSamePassword, setIsSamePassword] = useState(true);
   const [_isPasswordValid, setIsPasswordValid] = useState(false);

   const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      const newData = { ...data, [id]: value };
      setData(newData);

      if (id === "password") {
         setIsSamePassword(newData.confirmPassword === "" || value === newData.confirmPassword);
      } else if (id === "confirmPassword") {
         setIsSamePassword(value === newData.password);
      }
   }

   const getConfirmPasswordError = () => {
      if (data.confirmPassword === "" || isSamePassword) return undefined;
      return t('register.passwordNotMatch');
   }

   const isFormValid = () => {
      if (loading) return false;
      if (isRegister) {
         return data.username.trim() !== "" &&
            data.email.trim() !== "" &&
            data.password !== "" &&
            _isPasswordValid &&
            data.confirmPassword !== "" &&
            isSamePassword;
      }
      return data.email.trim() !== "" && data.password !== "";
   }

   const handleSubmit = () => {
      if (!isFormValid()) return;
      onSubmit(data);
   }

   const navigateAuth = () => {
      if (isRegister) {
         router.push('/login');
      } else {
         router.push('/register');
      }
   }

   const _renderButtonText = () => {
      const buttonText = isRegister ? 
         t('register.registerButton') : 
         t('login.loginButton')
      
      const additional = loading ? "..." : ""
      return buttonText + additional;
   }
   
   return (
      <div className="w-full max-w-md">
         <WebSample
          title="Ngahiji"
          description={t("description")}
        />

         {/* Form Card */}
         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <div className="space-y-4">
            {isRegister && (
               <FormItem
                  label={t('register.username')}
                  name="username"
                  required
               >
                  <Input
                     required
                     id="username"
                     type="text"
                     value={data.username}
                     placeholder={t('register.usernamePlaceholder')}
                     className="mt-1 rounded-xl"
                     onChange={handleDataChange}
                  />
               </FormItem>
            )} 

            <FormItem
               label={t(isRegister ? 'register.email' : 'login.email')}
               name="email"
               required
               type="email"
            >
               <Input
                  type="email"
                  value={data.email}
                  placeholder={t(isRegister ? 'register.emailPlaceholder' : 'login.emailPlaceholder')}
                  className="mt-1 rounded-xl"
                  onChange={handleDataChange}
               />
            </FormItem>

            <FormItem
               label={t(isRegister ? 'register.password' : 'login.password')}
               name="password"
               required
            >
               <PasswordInput
                  id="password"
                  value={data.password}
                  placeholder={t(isRegister ? 'register.passwordPlaceholder' : 'login.passwordPlaceholder')}
                  className="mt-1 rounded-xl"
                  onChange={handleDataChange}
                  showValidation={isRegister}
                  validationMessages={{
                     minLength: t('register.passwordMinLength'),
                     specialChar: t('register.passwordSpecialChar')
                  }}
                  onValidationChange={(result: ValidationResult) => setIsPasswordValid(result.isValid)}
               />
            </FormItem>

            {isRegister && (
               <FormItem
                  label={t('register.confirmPassword')}
                  name="confirmPassword"
                  required
               >
                  <PasswordInput
                     id="confirmPassword"
                     inputType={isSamePassword ? "normal" : "danger"}
                     value={data.confirmPassword}
                     placeholder={t('register.confirmPasswordPlaceholder')}
                     className="mt-1 rounded-xl"
                     onChange={handleDataChange}
                     errorMessage={getConfirmPasswordError()}
                  />
               </FormItem>
            )} 

            {!isRegister && (
               <div className="flex justify-end">
                  <button type="button" onClick={() => router.push('/forgot')} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  {t('login.forgotPassword')}
                  </button> 
               </div>
            )}

            <Button
               onClick={handleSubmit}
               disabled={!isFormValid()}
               className={cn("w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white", 
                  (loading || !isFormValid()) && "opacity-70 cursor-not-allowed"
               )}
            >
               {_renderButtonText()}
            </Button>

            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
               </div>
               <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                  {t('login.loginWith')}
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <Button variant="outline" className="rounded-xl">
                  <GoogleIcon />
                  {t('social.google')}
               </Button>
               <Button variant="outline" className="rounded-xl">
                  <FacebookIcon />
                  {t('social.facebook')}
               </Button> 
            </div>
            </div>

            <div className="mt-6 text-center">
               <p
                  className="text-gray-600 dark:text-gray-400"
               >
                  {isRegister ? 
                     t('register.haveAccount') : 
                     t('login.noAccount')}{' '}

                  <button 
                     onClick={navigateAuth}
                     className="text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer"
                  >
                     {isRegister ? 
                        t('register.login') : 
                        t('login.register')
                     }
                  </button>
               </p>
            </div>
         </div>
      </div> 
   )
}

const GoogleIcon = () => (
   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
         fill="currentColor"
         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
         fill="currentColor"
         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
         fill="currentColor"
         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
         fill="currentColor"
         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
   </svg>
)

const FacebookIcon = () => (
   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
   </svg>
)

export default Auth;