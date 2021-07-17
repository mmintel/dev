import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import { Prisma, User } from "@prisma/client";
import { githubGraphqlClient } from "../../../server/http/githubGraphqlClient";

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile, tokens): any {
        return {
          id: profile.id.toString(),
          username: profile.login,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        } as Prisma.UserCreateInput;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    async session(session, user: User) {
      const account = await prisma.account.findFirst({
        where: { userId: user.id },
      });
      session.user = user;
      githubGraphqlClient.setHeader(
        "Authorization",
        `token ${account.accessToken}`
      );
      return session;
    },
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
