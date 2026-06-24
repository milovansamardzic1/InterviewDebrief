import type { AuthUser } from "@interwjuer/contracts";

import type { UserRepository } from "../ports/user.repository.js";

export class GetCurrentUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<AuthUser | null> {
    return this.users.findById(userId);
  }
}
