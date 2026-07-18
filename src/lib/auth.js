import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},

        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const sql = `
          SELECT *
          FROM mst_users
          WHERE username = ?
          LIMIT 1
        `;

        const users = await query(sql, [credentials.username]);

        if (!users || users.length === 0) {
          return null;
        }

        const user = users[0];

        const match = await bcrypt.compare(credentials.password, user.password);

        if (!match) {
          return null;
        }

        return {
          id: user.id,

          username: user.username,

          role: user.role,

          first_name: user.first_name,

          last_name: user.last_name,

          name: `${user.first_name} ${user.last_name}`,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/usr-login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        token.role = user.role;

        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;

      session.user.role = token.role;

      session.user.username = token.username;

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
