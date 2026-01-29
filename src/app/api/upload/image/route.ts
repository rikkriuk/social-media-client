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
      const file = formData.get("file") as File;

      if (!file) {
         return NextResponse.json(
            { ok: false, message: "No file provided" },
            { status: 400 }
         );
      }

      const backendFormData = new FormData();
      backendFormData.append("file", file);

      const response = await httpRequest.post(
         "/upload/image",
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
      console.error("Image upload error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to upload image" },
         { status: error?.status || 400 }
      );
   }
}
