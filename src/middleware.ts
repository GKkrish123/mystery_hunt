import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  const tokenBoom = (await cookies()).get("token-boom")?.value;

  if (!publicRoutes.includes(req.nextUrl.pathname)) {
    if (
      (!token || !tokenBoom || Date.now() >= parseInt(tokenBoom, 10)) &&
      req.nextUrl.pathname !== "/verify"
    ) {
      return NextResponse.redirect(new URL("/verify", req.url));
    }
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
