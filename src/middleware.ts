import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // RBAC: Client only routes
    if (path.startsWith("/client") && token?.role !== "CLIENT" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // RBAC: Freelancer only routes
    if (path.startsWith("/freelancer") && token?.role !== "FREELANCER" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // RBAC: Admin only routes
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Prevent authenticated users from accessing login/register pages
    if ((path === "/login" || path === "/register") && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Enforce verification (only if we have a token and is_verified is explicitly false)
    if (token && token.is_verified === false && path !== "/verify" && !path.startsWith("/api/auth/resend")) {
      return NextResponse.redirect(new URL(`/verify?email=${encodeURIComponent(token.email as string)}`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Дараах route-ууд руу нэвтрээгүй үед орж болно
        if (
          path === "/login" || 
          path === "/register" || 
          path === "/verify" || 
          path.startsWith("/api/auth") // Next-auth-ын дотоод API-ууд
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/client/:path*",
    "/freelancer/:path*",
    "/admin/:path*",
    "/api/:path*", // Бүх API route-ууд
    "/login",
    "/register",
    "/verify",
  ],
};
