import { httpRequest } from "@/helpers/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();

      const response = await httpRequest.post("/comments", body);

      return NextResponse.json(response.data);
   } catch (error) {
      console.error("Failed to create comment:", error);
      return NextResponse.json(
         { error: "Failed to create comment" },
         { status: 500 }
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
            { error: "postId is required" },
            { status: 400 }
         );
      }

      const response = await httpRequest.get(`/comments/post/${postId}`, {
         params: {
            limit,
            offset,
         },
      });

      return NextResponse.json(response.data);
   } catch (error) {
      console.error("Failed to fetch comments:", error);
      return NextResponse.json(
         { error: "Failed to fetch comments" },
         { status: 500 }
      );
   }
}
