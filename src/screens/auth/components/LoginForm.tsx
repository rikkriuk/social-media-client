import Auth from "@/components/Auth";
import { LoginFormProps } from "@/types/auth";

export const LoginForm = ({ loading, onSubmit, tFunc }: LoginFormProps) => {
   return (
      <Auth
         isRegister={false}
         loading={loading}
         onSubmit={onSubmit}
         t={tFunc}
      />
   );
};
