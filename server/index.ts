import { createPrismaClient } from "./lib/createPrismaClient";
import { githubGraphqlClient } from "./http/githubGraphqlClient";
import { GithubRepository } from "./repositories/GithubRepository";
import { UserRepository } from "./repositories/UserRepository";
import { CreateUserProfileUseCase } from "./usecases/CreateUserProfileUseCase";
import { GetUserProfileUseCase } from "./usecases/GetUserProfileUseCase";
import { RefreshUserProfileUseCase } from "./usecases/RefreshUserProfileUseCase";

const prisma = createPrismaClient();

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

prisma.$use(async (params, next) => {
  console.log("HOOK FIRED", params);
  const result = await next(params);
  if (params.model === "Account" && params.action === "create") {
    console.log("params for create account hook", params);
    await createUserProfileUseCase.execute(params.args.data.userId);
  }
  return result;
});

// TODO eliminate all direct usages of prisma
export { prisma };
