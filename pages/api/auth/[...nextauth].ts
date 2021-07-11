import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import { Prisma, User } from "@prisma/client";

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
          profile: {
            create: {
              github: {
                create: {
                  name: profile.name,
                  followers: profile.followers,
                  following: profile.following,
                  id: profile.id.toString(),
                  login: profile.login,
                  publicGists: profile.public_gists,
                  publicRepos: profile.public_repos,
                  url: profile.url,
                  avatarUrl: profile.avatar_url,
                  blog: profile.blog,
                  company: profile.company,
                  hireable: profile.hireable,
                  accessToken: tokens.accessToken,
                },
              },
            },
          },
        } as Prisma.UserCreateInput;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
