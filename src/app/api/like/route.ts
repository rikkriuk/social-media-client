import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type"); // 'list' | 'check'
      const postId = searchParams.get("postId");
      const profileId = searchParams.get("profileId");

      if (!postId) {
         return NextResponse.json(
            { ok: false, message: "Post ID is required" },
            { status: 400 }
         );
      }

      if (type === "list") {
         const limit = searchParams.get("limit") || "10";
         const offset = searchParams.get("offset") || "0";
         const response = await httpRequest.get(`/likes`, {
            params: { postId, limit, offset },
         });
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      if (type === "check") {
         if (!profileId) {
            return NextResponse.json(
               { ok: false, message: "Profile ID is required for check" },
               { status: 400 }
            );
         }
         const response = await httpRequest.get(`/likes/check`, {
            params: { postId, profileId },
         });
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      return NextResponse.json(
         { ok: false, message: "Invalid type parameter" },
         { status: 400 }
      );
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Like GET error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to get like data" },
         { status: error?.status || 400 }
      );
   }
}

export async function POST(req: Request) {
   try {
      const token = await getTokenFromCookies();

      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const body = await req.json();
      const { type, postId, profileId } = body;

      if (!postId || !profileId) {
         return NextResponse.json(
            { ok: false, message: "Post ID and Profile ID are required" },
            { status: 400 }
         );
      }

      const config = await createAuthConfig();

      if (type === "like") {
         const response = await httpRequest.post(
            `/likes/like`,
            { postId, profileId },
            config
         );
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      if (type === "unlike") {
         const response = await httpRequest.post(
            `/likes/unlike`,
            { postId, profileId },
            config
         );
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      return NextResponse.json(
         { ok: false, message: "Invalid type parameter" },
         { status: 400 }
      );
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Like POST error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to process like action" },
         { status: error?.status || 400 }
      );
   }
}
