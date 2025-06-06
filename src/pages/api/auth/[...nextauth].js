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
    async jwt({ token, account, trigger, session:updateData }) {
      if (account) {
        token.accessToken = account.access_token;
        
        
        console.log(token.name)
        try {
          const res = await axios.post((`https://api.saeplatform.xyz/user/first-login`),{}
            ,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          
          if (res.data) {
            const response = res.data.user;
            
            token.githubName = response.name;
            token.organizations = response.organizations;
            token.isRoot = response.isRoot;
            token.activeRole = 'guest';
            token.selectedOrg = null;
            token.selectedOrgId = null;
          } else {
            console.warn("No se recibió 'role' desde el backend");
          }

        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error.message);
        }
      }

    if (trigger === "update" && updateData?.activeRole) {
      token.activeRole = updateData.activeRole;
      token.selectedOrg = updateData.selectedOrg;
      token.selectedOrgId = updateData.selectedOrgId;
    }
      return token;
    },

    

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.githubName = token.githubName;
      session.user.organizations = token.organizations;
      session.user.selectedOrg = token.selectedOrg;
      session.user.selectedOrgId = token.selectedOrgId
      session.user.activeRole = token.activeRole;
      session.user.isRoot = token.isRoot;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
