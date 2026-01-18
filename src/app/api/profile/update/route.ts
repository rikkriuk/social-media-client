import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
   try {
      const token = await getTokenFromCookies();

      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const body = await req.json();
      const { profileId, ...data } = body;

      if (!profileId) {
         return NextResponse.json(
            { ok: false, message: "Profile ID is required" },
            { status: 400 }
         );
      }

      const config = await createAuthConfig();
      const response = await httpRequest.patch(`/profiles/${profileId}`, data, config);

      return NextResponse.json({
         ok: true,
         data: response.data,
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Profile update error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to update profile" },
         { status: error?.status || 400 }
      );
   }
}
