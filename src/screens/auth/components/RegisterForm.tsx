import Auth from "@/components/Auth";
import { RegisterFormProps } from "@/types/auth";

export const RegisterForm = ({ loading, onSubmit, tFunc }: RegisterFormProps) => {
   return (
      <Auth
         isRegister={true}
         loading={loading}
         onSubmit={onSubmit}
         t={tFunc}
      />
   );
};
