import { httpRequest } from "@/helpers/api";
import { getTokenFromCookies, createAuthConfig } from "@/helpers/api.server";
import { generateQueryString } from "@/helpers/text";
import { ApiError } from "@/types/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const limit = searchParams.get("limit") || "10";
      const offset = searchParams.get("offset") || "0";
      const profileId = searchParams.get("profileId");

      let endpoint = `/posts${generateQueryString({ limit, offset })}`;
      if (profileId) {
         endpoint = `/posts/user/${profileId}${generateQueryString({ limit, offset })}`;
      }

      const response = await httpRequest.get(endpoint);

      return NextResponse.json({
         ok: true,
         data: response.data,
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Get posts error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to fetch posts" },
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
      const config = await createAuthConfig();

      const response = await httpRequest.post("/posts", body, config);

      return NextResponse.json({
         ok: true,
         data: response.data,
      });
   } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Create post error:", error);
      return NextResponse.json(
         { ok: false, message: error?.data?.message || "Failed to create post" },
         { status: error?.status || 400 }
      );
   }
}
