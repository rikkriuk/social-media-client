import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const token = await getTokenFromCookies();
      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const body = await request.json();
      const config = await createAuthConfig();
      const response = await httpRequest.post("/comments", body, config);

      return NextResponse.json({ ok: true, data: response.data });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Failed to create comment:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to create comment" },
         { status: error?.status || 500 }
      );
   }
}

export async function GET(request: NextRequest) {
   try {
      const searchParams = request.nextUrl.searchParams;
      const postId = searchParams.get("postId");
      const limit = searchParams.get("limit") || "10";
      const offset = searchParams.get("offset") || "0";

      if (!postId) {
         return NextResponse.json(
            { ok: false, message: "postId is required" },
            { status: 400 }
         );
      }

      const response = await httpRequest.get(`/comments/post/${postId}`, {
         params: { limit, offset },
      });

      return NextResponse.json({ ok: true, data: response.data });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Failed to fetch comments:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to fetch comments" },
         { status: error?.status || 500 }
      );
   }
}
