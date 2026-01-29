import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
   try {
      const postId = params.id;

      if (!postId) {
         return NextResponse.json(
            { ok: false, message: "Post ID is required" },
            { status: 400 }
         );
      }

      const response = await httpRequest.get(`/posts/${postId}`);

      return NextResponse.json({
         ok: true,
         data: response.data,
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Get post error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to fetch post" },
         { status: error?.status || 400 }
      );
   }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
   try {
      const token = await getTokenFromCookies();

      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const postId = params.id;

      if (!postId) {
         return NextResponse.json(
            { ok: false, message: "Post ID is required" },
            { status: 400 }
         );
      }

      const body = await req.json();
      const config = await createAuthConfig();
      const response = await httpRequest.patch(`/posts/${postId}`, body, config);

      return NextResponse.json({
         ok: true,
         data: response.data,
         message: "Post updated successfully",
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Update post error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to update post" },
         { status: error?.status || 400 }
      );
   }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
   try {
      const token = await getTokenFromCookies();

      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const postId = params.id;

      if (!postId) {
         return NextResponse.json(
            { ok: false, message: "Post ID is required" },
            { status: 400 }
         );
      }

      const config = await createAuthConfig();
      const response = await httpRequest.delete(`/posts/${postId}`, config);

      return NextResponse.json({
         ok: true,
         data: response.data,
         message: "Post deleted successfully",
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Delete post error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to delete post" },
         { status: error?.status || 400 }
      );
   }
}
