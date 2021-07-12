import { GithubRepository } from "../repositories/GithubRepository";

export class GetUserProfileUseCase {
  constructor(private githubRepository: GithubRepository) {}

  async execute(username: string) {
    const githubProfile = await this.githubRepository.getProfile(username);
    const githubRepos = await this.githubRepository.getRepos(username);

    return {
      github: {
        profile: githubProfile,
        repos: githubRepos,
      },
    };
  }
}
