import { httpRequest } from "@/helpers/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const searchParams = request.nextUrl.searchParams;
      const recipientProfileId = searchParams.get("recipientProfileId");
      const limit = searchParams.get("limit") || "20";
      const offset = searchParams.get("offset") || "0";

      if (!recipientProfileId) {
         return NextResponse.json(
            { error: "recipientProfileId is required" },
            { status: 400 }
         );
      }

      const response = await httpRequest.get("/notifications", {
         params: {
            recipientProfileId,
            limit,
            offset,
         },
      });

      return NextResponse.json(response.data);
   } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return NextResponse.json(
         { error: "Failed to fetch notifications" },
         { status: 500 }
      );
   }
}
