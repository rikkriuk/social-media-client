import { httpRequest } from "@/helpers/api";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id: commentId } = await params;

      const response = await httpRequest.delete(`/comments/${commentId}`);

      return NextResponse.json(response.data);
   } catch (error) {
      console.error("Failed to delete comment:", error);
      return NextResponse.json(
         { error: "Failed to delete comment" },
         { status: 500 }
      );
   }
}
