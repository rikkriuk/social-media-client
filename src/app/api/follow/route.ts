import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const type = searchParams.get("type"); // 'count' | 'followers' | 'following'

      if (!userId) {
         return NextResponse.json(
            { ok: false, message: "User ID is required" },
            { status: 400 }
         );
      }

      if (type === "count") {
         const response = await httpRequest.get(`/user-follows/count/${userId}`);
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      if (type === "followers") {
         const response = await httpRequest.get(`/user-follows/followers`, {
            params: { userId },
         });
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      if (type === "following") {
         const response = await httpRequest.get(`/user-follows/following`, {
            params: { userId },
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
      console.error("Follow GET error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to get follow data" },
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
      const { type, followerId, followingId } = body;

      if (!followerId || !followingId) {
         return NextResponse.json(
            { ok: false, message: "Follower ID and Following ID are required" },
            { status: 400 }
         );
      }

      const config = await createAuthConfig();

      if (type === "follow") {
         const response = await httpRequest.post(
            `/user-follows/follow`,
            { followerId, followingId },
            config
         );
         return NextResponse.json({
            ok: true,
            data: response.data,
         });
      }

      if (type === "unfollow") {
         const response = await httpRequest.post(
            `/user-follows/unfollow`,
            { followerId, followingId },
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
      console.error("Follow POST error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to process follow action" },
         { status: error?.status || 400 }
      );
   }
}
