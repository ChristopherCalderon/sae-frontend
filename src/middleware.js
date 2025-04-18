
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Rutas protegidas para admin
    const adminProtectedRoutes = [
      "/dashboard/admin",
      "/dashboard/modelos",
    ];

    // Verificar si la ruta actual requiere rol admin
    const isAdminRoute = adminProtectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Si la ruta es protegida y el usuario no es admin, redirigir
    if (isAdminRoute && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/clases", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Verificación básica de que el usuario está autenticado
        return !!token;
      },
    },
    pages: {
      signIn: "/", // Redirige al login
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*"
  ],
};