import Auth from "@/components/Auth";

interface RegisterFormProps {
   loading: boolean;
   onSubmit: (data: Record<string, string>) => void;
   tFunc: (key: string) => string;
}

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
