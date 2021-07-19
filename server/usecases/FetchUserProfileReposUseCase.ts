import { UseCase } from "../domain/UseCase";
import { UserProfileNotFoundError } from "../errors/UserProfileNotFoundError";
import { GithubRepository } from "../repositories/GithubRepository";
import { UserRepository } from "../repositories/UserRepository";

export class FetchUserProfileReposUseCase implements UseCase {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

  async execute(username: string) {
    const githubRepos = await this.githubRepository.getRepos(username);
    const profile = await this.userRepository.findProfileByUsername(username);

    if (!profile) {
      throw new UserProfileNotFoundError();
    }

    for (const repo of githubRepos) {
      await this.userRepository.addRepoToProfile(profile.id, {
        url: repo.url,
        title: repo.name,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        provider: "github",
        id: repo.id,
      });
    }
  }
}
