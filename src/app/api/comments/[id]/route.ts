import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { ApiError } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const token = await getTokenFromCookies();
      if (!token) {
         return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
         );
      }

      const { id: commentId } = await params;
      const config = await createAuthConfig();
      const response = await httpRequest.delete(`/comments/${commentId}`, config);

      return NextResponse.json({ ok: true, data: response.data });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Failed to delete comment:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to delete comment" },
         { status: error?.status || 500 }
      );
   }
}
