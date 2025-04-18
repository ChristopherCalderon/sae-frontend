import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";

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
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;

        try {
          const res = await axios.get(
            "https://sae-backend-n9d3.onrender.com/repo/whoami?org=ProyectoGraduacionUCA",
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          if (res.data?.role) {
            token.role = res.data.role;
          } else {
            console.warn("No se recibió 'role' desde el backend");
          }

        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error.message);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.role = "admin";
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
