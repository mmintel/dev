import prisma from "../lib/prisma";
import { githubClient } from "./http/githubClient";
import { GithubRepository } from "./repositories/GithubRepository";
import { UserRepository } from "./repositories/UserRepository";
import { GetUserProfileUseCase } from "./usecases/GetUserProfileUseCase";
import { RefreshUserProfileUseCase } from "./usecases/RefreshUserProfileUseCase";

const githubRepository = new GithubRepository(githubClient);
const userRepository = new UserRepository(prisma);

export const refreshUserProfileUseCase = new RefreshUserProfileUseCase(
  userRepository,
  githubRepository
);

export const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
