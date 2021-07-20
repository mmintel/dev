import { Account, Prisma, PrismaClient, Profile, User } from "@prisma/client";

export type CreateProfileInput = Omit<
  Prisma.ProfileCreateInput,
  "feed" | "user" | "github"
>;

export type UpdateProfileInput = Omit<
  Prisma.ProfileUpdateInput,
  "feed" | "user" | "github"
>;

export interface IUserRepository {
  findByUsername(username: string): Promise<User>;
  findByUsernameWithProfile(username: string): Promise<
    User & {
      profile: Profile;
    }
  >;
  findUserByToken(token: string): Promise<User>;
  findAccountByUsername(username: string): Promise<Account>;
  findProfileByUsername(username: string): Promise<Profile>;
  createUserProfile(
    username: string,
    data: {
      profile: CreateProfileInput;
      github: Prisma.GithubAccountCreateInput;
    }
  ): Promise<void>;
  updateUserProfile(
    profileId: string,
    data: {
      profile: UpdateProfileInput;
      github: Prisma.GithubAccountUpdateInput;
    }
  ): Promise<void>;
  addRepoToProfile(
    profileId: string,
    data: Prisma.FeedCreateInput & Omit<Prisma.RepoCreateInput, "feed">
  ): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private client: PrismaClient) {}

  async findById(userId: string) {
    return this.client.user.findUnique({ where: { id: userId } });
  }

  async findByUsername(username: string) {
    return this.client.user.findUnique({ where: { username } });
  }

  async findByUsernameWithProfile(username: string) {
    const user = await this.client.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    return user;
  }

  async findUserByToken(token: string) {
    const account = await this.client.account.findFirst({
      where: { accessToken: token },
    });
    const user = await this.client.user.findUnique({
      where: { id: account.userId },
    });
    return user;
  }

  async findAccountByUsername(username: string) {
    const account = await this.client.account.findFirst({
      where: { user: { username } },
    });
    return account;
  }

  async findProfileByUsername(username: string) {
    return this.client.profile.findFirst({
      where: { user: { username } },
    });
  }

  async createUserProfile(
    username: string,
    data: {
      profile: CreateProfileInput;
      github: Prisma.GithubAccountCreateInput;
    }
  ) {
    await this.client.profile.create({
      data: {
        user: { connect: { username } },
        ...data.profile,
        github: {
          create: data.github,
        },
        feed: {},
      },
    });
  }

  async updateUserProfile(
    profileId: string,
    data: {
      profile: UpdateProfileInput;
      github: Prisma.GithubAccountUpdateInput;
    }
  ) {
    await this.client.profile.update({
      where: { id: profileId },
      data: data.profile,
    });

    await this.client.githubAccount.updateMany({
      where: { Profile: { id: profileId } },
      data: data.github,
    });
  }

  async addRepoToProfile(
    profileId: string,
    data: Prisma.FeedCreateInput & Omit<Prisma.RepoCreateInput, "feed">
  ) {
    await this.client.feed.create({
      data: {
        url: data.url,
        Profile: {
          connect: {
            id: profileId,
          },
        },
        Repo: {
          create: {
            title: data.title,
            stars: data.stars,
            forks: data.forks,
            provider: "github",
            id: data.id,
          },
        },
      },
    });
  }
}
