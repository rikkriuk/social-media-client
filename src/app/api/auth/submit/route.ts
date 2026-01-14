import { httpRequest } from "@/helpers/api";
import { ApiError } from "@/types/api";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body as any;

    if (type === "resend") {
      const { userId } = body;
      const response = await httpRequest.post("/auth/resend", { userId });
      console.log("Send OTP to", userId);
      return NextResponse.json(response.data);
    }

    if (type === "otp") {
      const response = await httpRequest.post("/auth/verify", body.data);

      if (response.data) {
        return NextResponse.json(response.data);
      }
    }

    if (type === "login") {
      const { identifier, password } = body;

      if (identifier && password) {
        const response = await httpRequest.post("/auth/login", {
          identifierType: "Email",
          identifier,
          password
        });

        return NextResponse.json(response.data);
      }
    }

    if (type === "register") {
      const { username, email, password } = body;
      if (!username || !email || !password) {
        return NextResponse.json({ ok: false, message: "Invalid registration data" }, { status: 400 });
      }

      const response = await httpRequest.post("/auth/signup", {
        username,
        email,
        password
      });

      return NextResponse.json(response.data);
    }

    return NextResponse.json({ ok: false, message: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const error = err as ApiError;
    console.error("Auth submit error:", error);
    return NextResponse.json(
      { ok: false, message: error?.data?.message || "Bad request" },
      { status: error?.status || 400 }
    );
  }
}
