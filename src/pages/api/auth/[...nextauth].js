import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "repo read:org admin:org user read:user user:email workflow",
        },
      },
    }),
  ],
  callbacks: {   async jwt({ token, account }) {
    if (account) {
      // Guardamos el access token de GitHub
      token.accessToken = account.access_token;

      // Llamamos al endpoint de la API para obtener el rol del usuario
      const res = await fetch("https://sae-backend-n9d3.onrender.com/repo/whoami?org=ProyectoGraduacionUCA", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Guardamos el rol del usuario en el token
        token.role = data.role;
      }
    }
    return token;
  },
  async session({ session, token }) {
    // Hacemos que el rol y el access token estén disponibles en la sesión
    session.accessToken = token.accessToken;
    session.role = token.role;
    return session;
  },
},
secret: process.env.NEXTAUTH_SECRET, // Asegúrate de definir el secreto en tu archivo .env

});
