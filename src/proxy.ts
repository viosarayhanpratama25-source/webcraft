import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin pages require ADMIN or STAFF role
    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "STAFF") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Dashboard pages require standard login, let's redirect if no role is defined (just in case)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/order/details", "/order/review", "/order/payment", "/order/success"],
};
