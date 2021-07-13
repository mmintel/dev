import prisma from "../lib/prisma";
import { githubGraphqlClient } from "./http/githubGraphqlClient";
import { GithubRepository } from "./repositories/GithubRepository";
import { UserRepository } from "./repositories/UserRepository";
import { GetUserProfileUseCase } from "./usecases/GetUserProfileUseCase";
import { RefreshUserProfileUseCase } from "./usecases/RefreshUserProfileUseCase";

const githubRepository = new GithubRepository(githubGraphqlClient);
const userRepository = new UserRepository(prisma);

export const refreshUserProfileUseCase = new RefreshUserProfileUseCase(
  githubRepository,
  userRepository
);

export const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
