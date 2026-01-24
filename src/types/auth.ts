export const initialAuth: Record<string, string> = {
   username: "testuser12",
   email: "testuser12@gmail.com",
   password: "test123!",
   confirmPassword: "test123!",
}

export const initialOtp: Record<string, string> = {
   userId: "",
   code: "",
}

export type AuthProps = {
   isRegister: boolean;
   loading?: boolean;
   onSubmit: (data: Record<string, string>) => void;
   t: (key: string) => string;
}

export interface ResendSectionProps {
   canResend: boolean;
   timeLeft: number;
   resending: boolean;
   onResend: () => void;
   tFunc: (key: string, options?: any) => string;
}

export interface OtpFormProps {
   code: string;
   onChange: (code: string) => void;
   onSubmit: (e: React.FormEvent) => void;
   loading: boolean;
   tFunc: (key: string, options?: any) => string;
}

export interface UseOtpLogicProps {
   onSuccess?: () => void;
   tFunc: (key: string, options?: any) => string;
}

export interface LoginFormProps {
   loading: boolean;
   onSubmit: (data: Record<string, string>) => void;
   tFunc: (key: string) => string;
}

export interface RegisterFormProps {
   loading: boolean;
   onSubmit: (data: Record<string, string>) => void;
   tFunc: (key: string) => string;
}

export interface UseLoginProps {
   tFunc: (key: string) => string;
}

export interface UseRegisterProps {
   tFunc: (key: string) => string;
}