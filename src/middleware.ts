import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authOnlyRoutes = [
  "/login",
  "/register",
  "/otp",
  "/forgot"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthOnlyRoute = authOnlyRoutes.some((route) => pathname.startsWith(route));

  if (token && isAuthOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isAuthOnlyRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
