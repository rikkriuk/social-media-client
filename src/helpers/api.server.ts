import { cookies } from "next/headers";

const getTokenFromCookies = async (): Promise<string | null> => {
   try {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get("token");

      if (!tokenCookie) return null;

      let token = tokenCookie.value;
      try {
         token = JSON.parse(token);
      } catch {
         // Token is already a plain string
      }
      return token;
   } catch {
      return null;
   }
}

const getAuthHeaders = async (): Promise<Record<string, string>> => {
   const token = await getTokenFromCookies();
   if (!token) return {};

   return {
      Authorization: `Bearer ${token}`,
   };
}

const createAuthConfig = async () => {
   const headers = await getAuthHeaders();
   return { headers };
}

export {
   getTokenFromCookies,
   createAuthConfig,
   getAuthHeaders,
}