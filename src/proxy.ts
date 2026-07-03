import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authProxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin pages require ADMIN or STAFF role
    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "STAFF") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Dashboard pages require standard login
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export default authProxy;
export const proxy = authProxy;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/order/details", "/order/review", "/order/payment", "/order/success"],
};
