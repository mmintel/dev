import { GithubRepository } from "../repositories/GithubRepository";
import { UserRepository } from "../repositories/UserRepository";

export class RefreshUserProfileUseCase {
  constructor(
    private userRepository: UserRepository,
    private githubRepository: GithubRepository
  ) {}

  async execute(username: string) {
    const account = await this.userRepository.findAccountByUserName(username);
    const githubProfile = await this.githubRepository.getProfile(username);
    const githubRepos = await this.githubRepository.getRepos(username);
    const githubContributions = await this.githubRepository.getContributions(
      username,
      account.accessToken
    );

    return {
      github: {
        profile: githubProfile,
        repos: githubRepos,
        contributions: githubContributions,
      },
    };
  }
}
