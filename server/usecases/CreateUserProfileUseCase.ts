import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { UserProfileAlreadyExistsError } from "../errors/UserProfileAlreadyExistsError";
import { GithubRepository } from "../repositories/GithubRepository";
import { UserRepository } from "../repositories/UserRepository";

export class CreateUserProfileUseCase {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

  async execute(username: string) {
    const account = await this.userRepository.findAccountByUsername(username);
    const githubProfile = await this.githubRepository.getUser(username);
    const githubRepos = await this.githubRepository.getRepos(username);
    const profile = await prisma.profile.findFirst({
      where: { user: { username } },
    });

    if (profile) {
      throw new UserProfileAlreadyExistsError();
    }

    await prisma.profile.create({
      data: {
        user: { connect: { username } },
        company: githubProfile.company,
        location: githubProfile.location,
        homepageUrl: githubProfile.blog,
        isHireable: githubProfile.isHireable,
        github: {
          create: {
            id: githubProfile.id,
            followersCount: githubProfile.followers.totalCount,
            followingCount: githubProfile.following.totalCount,
            gistsCount: githubProfile.gists.totalCount,
            reposCount: githubProfile.repositories.totalCount,
            login: githubProfile.login,
            name: githubProfile.name,
            url: githubProfile.url,
            accessToken: account.accessToken,
          },
        },
        feed: {},
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
