import { UserRepository } from "../repositories/UserRepository";

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(username: string) {
    return this.userRepository.findByUsernameWithProfile(username);
  }
}
