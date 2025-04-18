// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirige al login si no hay sesión
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",   // Todas las rutas dentro de /dashboard
  ],
};