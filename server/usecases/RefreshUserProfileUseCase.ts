import { UseCase } from "../core/UseCase";
import { UserProfileNotFoundError } from "../errors/UserProfileNotFoundError";
import { GithubRepository } from "../repositories/GithubRepository";
import { UserRepository } from "../repositories/UserRepository";

export class RefreshUserProfileUseCase implements UseCase {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

  async execute(username: string) {
    const githubProfile = await this.githubRepository.getUser(username);
    const profile = await this.userRepository.findProfileByUsername(username);

    if (!profile) {
      throw new UserProfileNotFoundError();
    }

    await this.userRepository.updateUserProfile(profile.id, {
      profile: {
        company: githubProfile.company,
        location: githubProfile.location,
        homepageUrl: githubProfile.blog,
        isHireable: githubProfile.isHireable,
      },
      github: {
        id: githubProfile.id,
        followersCount: githubProfile.followers.totalCount,
        followingCount: githubProfile.following.totalCount,
        gistsCount: githubProfile.gists.totalCount,
        reposCount: githubProfile.repositories.totalCount,
        login: githubProfile.login,
        name: githubProfile.name,
        url: githubProfile.url,
      },
    });
  }
}
