// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);
        if (
          credentials.username === "chiwanthakasun" &&
          credentials.password === "Kchordgroup*789789"
        ) {
          // return user object with custom keys
          return { id: "1", name: "Kasun Chiwantha", role: 1 };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/auth/usr-login", // Custom login page
  },

  session: {
    strategy: "jwt", // Use JWT for session
  },

  callbacks: {
    // Store custom fields in JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    // Expose custom fields to client
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Required for JWT encryption
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
