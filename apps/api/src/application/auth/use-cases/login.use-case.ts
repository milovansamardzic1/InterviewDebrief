import type { AuthResponse } from "@interwjuer/contracts";

import type { AuthTokenService } from "../ports/auth-token.service.js";
import type { PasswordHasher } from "../ports/password-hasher.js";
import type { UserRepository } from "../ports/user.repository.js";

export type LoginInput = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: AuthTokenService,
  ) {}

  async execute(input: LoginInput): Promise<AuthResponse | null> {
    const user = await this.users.findByEmail(input.email.toLowerCase());

    if (!user) {
      return null;
    }

    const passwordMatches = await this.passwordHasher.verify(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return null;
    }

    const accessToken = await this.tokens.signAccessToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      expiresIn: this.tokens.getExpiresInSeconds(),
    };
  }
}
