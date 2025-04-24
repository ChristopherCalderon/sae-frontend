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
        
        console.log(token.name)
        try {
          const res = await axios.post((`https://sae-backend-n9d3.onrender.com/user/first-login?username=${token.name}`),{}
            ,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          
          if (res.data) {
            const response = res.data.user;
            token.organizations = response.organizations;
            token.isRoot = response.isRoot;
            token.role = 'guest';
            token.selectedOrg = null;
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
      session.organizations = token.organizations;
      session.role = token.role;
      session.selectedOrg = token.selectedOrg;
      session.isRoot = token.isRoot;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
