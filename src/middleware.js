import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // 1. Manejo de usuarios root
    if (token?.isRoot) {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/organizations")) {
        return NextResponse.redirect(new URL("/system/usuarios", req.url));
      }
      return NextResponse.next();
    }

    // 2. Para usuarios NO root
    if (pathname.startsWith("/system")) {
      return NextResponse.redirect(new URL("/dashboard/clases", req.url));
    }

    // 3. Permitir acceso a /organizations solo si no tiene rol
    if (pathname === "/organizations") {
      // Permitir acceso si es guest o necesita seleccionar org
      return NextResponse.next();
    }

    // 4. Manejo de roles 'guest' (solo para rutas que no sean /organizations)
    if (token?.activeRole === "guest" && pathname !== "/organizations") {
      return NextResponse.redirect(new URL("/organizations", req.url));
    }

    // 5. Protección de rutas admin
    const adminProtectedRoutes = [
      "/dashboard/admin",
      "/dashboard/modelos",
      "/dashboard/configurar",
    ];

    const isAdminRoute = adminProtectedRoutes.some(route => 
      pathname.startsWith(route)
    );

    if (isAdminRoute && token?.activeRole !== "ORG_Admin") {
      return NextResponse.redirect(new URL("/dashboard/clases", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/system/:path*",
    "/organizations"
  ],
};