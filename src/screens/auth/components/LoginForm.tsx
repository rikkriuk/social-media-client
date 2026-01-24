import Auth from "@/components/Auth";

interface LoginFormProps {
   loading: boolean;
   onSubmit: (data: Record<string, string>) => void;
   tFunc: (key: string) => string;
}

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
