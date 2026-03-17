// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";

const saltRounds = 10;
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const sql = `SELECT * FROM mst_users WHERE username=?`;
          const data = await query(sql, [credentials.username]);

          if (!data || data.length <= 0) {
            return null;
          }

          const userData = data[0];

          const isMatch = await bcrypt.compare(
            credentials.password,
            userData.password,
          );

          if (!isMatch) {
            return null;
          }

          const { password, first_name, last_name, ...rest } = userData;

          const safeUser = {
            ...rest,
            first_name,
            last_name,
            name: `${first_name} ${last_name}`,
          };

          return safeUser;
        } catch (err) {
          console.log(err);
          return null;
        }
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
