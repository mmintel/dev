import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { GithubRepository } from "../repositories/GithubRepository";
import { UserRepository } from "../repositories/UserRepository";

export class RefreshUserProfileUseCase {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

  async execute(username: string) {
    const account = await this.userRepository.findAccountByUsername(username);
    const githubProfile = await this.githubRepository.getProfile(username);
    const githubRepos = await this.githubRepository.getRepos(username);
    const profile = await prisma.profile.findFirst({
      where: { user: { username } },
    });

    // TODO make new use case CreateUserProfileUseCase

    const profileData: Prisma.ProfileCreateInput = {
      company: githubProfile.company,
      location: githubProfile.location,
      homepageUrl: githubProfile.homepageUrl,
      isHireable: githubProfile.isHireable,
      github: { create: {} },
    };

    if (!profile) {
      await prisma.profile.create({
        data: {},
      });
    } else {
      await prisma.profile.updateMany({
        where: { user: { username } },
        data: profileData,
      });
    }

    await prisma.githubAccount.create({
      data: {
        id: githubProfile.id,
        followersCount: githubProfile.followers.totalCount,
        followingCount: githubProfile.following.totalCount,
        gistsCount: githubProfile.gists.totalCount,
        reposCount: githubProfile.repositories.totalCount,
        login: githubProfile.login,
        name: githubProfile.name,
        url: githubProfile.url,
        accessToken: account.accessToken,
        Profile: {
          connect: {
            id: profile.id,
          },
        },
      },
    });

    for (const repo of githubRepos) {
      await prisma.feed.create({
        data: {
          url: repo.url,
          Profile: {
            connect: {
              id: profile.id,
            },
          },
          Repo: {
            create: {
              title: repo.name,
              stars: repo.stargazerCount,
              forks: repo.forkCount,
              provider: "github",
              id: repo.id,
            },
          },
        },
      });
    }
  }
}
