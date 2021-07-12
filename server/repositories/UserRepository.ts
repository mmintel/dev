import { PrismaClient } from "@prisma/client";

export class UserRepository {
  constructor(private client: PrismaClient) {}

  async findByUsername(username: string) {
    return this.client.user.findUnique({ where: { username } });
  }

  async findByUsernameWithProfile(username: string) {
    const user = await this.client.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    return user;
  }

  async findAccountByUserName(username: string) {
    const user = await this.findByUsername(username);
    const account = await this.client.account.findUnique({
      where: { id: user.id },
    });
    return account;
  }
}
