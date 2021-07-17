import prisma from "../lib/prisma";
import { githubGraphqlClient } from "./http/githubGraphqlClient";
import { GithubRepository } from "./repositories/GithubRepository";
import { UserRepository } from "./repositories/UserRepository";
import { CreateUserProfileUseCase } from "./usecases/CreateUserProfileUseCase";
import { GetUserProfileUseCase } from "./usecases/GetUserProfileUseCase";
import { RefreshUserProfileUseCase } from "./usecases/RefreshUserProfileUseCase";

const githubRepository = new GithubRepository(githubGraphqlClient);
const userRepository = new UserRepository(prisma);

export const createUserProfileUseCase = new CreateUserProfileUseCase(
  githubRepository,
  userRepository
);

export const refreshUserProfileUseCase = new RefreshUserProfileUseCase(
  githubRepository,
  userRepository
);

export const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

// TODO find better place for hooks
prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    console.log("params for create user hook", params);
    await createUserProfileUseCase.execute(params.args.username);
  }
  next(params);
});
