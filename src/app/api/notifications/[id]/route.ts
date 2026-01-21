import { httpRequest } from "@/helpers/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id: notificationId } = await params;

      const response = await httpRequest.post(
         `/notifications/${notificationId}/mark-as-read`
      );

      return NextResponse.json(response.data);
   } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return NextResponse.json(
         { error: "Failed to mark notification as read" },
         { status: 500 }
      );
   }
}
