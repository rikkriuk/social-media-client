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