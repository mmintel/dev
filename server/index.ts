import { GithubRepository } from "./repositories/GithubRepository";
import { GetUserProfileUseCase } from "./usecases/GetUserProfileUseCase";

const githubRepository = new GithubRepository();

export const getUserProfileUseCase = new GetUserProfileUseCase(
  githubRepository
);
