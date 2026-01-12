export const initialAuth: Record<string, string> = {
   username: "testuser",
   email: "testuser@gmail.com",
   password: "test",
   confirmPassword: "test",
}

export type AuthProps = {
   isRegister: boolean;
   loading?: boolean;
   onSubmit: (data: Record<string, string>) => void;
   t: (key: string) => string;
}