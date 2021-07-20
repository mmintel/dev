import { UserProfileAlreadyExistsError } from "../errors/UserProfileAlreadyExistsError";
import { GithubRepository } from "../repositories/GithubRepository";
import { UserRepository } from "../repositories/UserRepository";

export class CreateUserProfileUseCase {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    const account = await this.userRepository.findAccountByUsername(
      user.username
    );
    const githubProfile = await this.githubRepository.getUser(user.username);
    const profile = await this.userRepository.findProfileByUsername(
      user.username
    );

    if (profile) {
      throw new UserProfileAlreadyExistsError();
    }

    await this.userRepository.createUserProfile(user.username, {
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
        accessToken: account.accessToken,
      },
    });

    console.info(`Successfully created profile for "${user.username}"!`);
  }
}
