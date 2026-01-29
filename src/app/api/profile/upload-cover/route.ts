import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const token = await getTokenFromCookies();

      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const formData = await req.formData();
      const profileId = formData.get("profileId") as string;
      const file = formData.get("file") as File;

      if (!profileId) {
         return NextResponse.json(
            { ok: false, message: "Profile ID is required" },
            { status: 400 }
         );
      }

      if (!file) {
         return NextResponse.json(
            { ok: false, message: "No file provided" },
            { status: 400 }
         );
      }

      const backendFormData = new FormData();
      backendFormData.append("file", file);

      const response = await httpRequest.post(
         `/profiles/${profileId}/upload-cover`,
         backendFormData,
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );

      return NextResponse.json({
         ok: true,
         data: response.data,
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Cover image upload error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to upload cover image" },
         { status: error?.status || 400 }
      );
   }
}
