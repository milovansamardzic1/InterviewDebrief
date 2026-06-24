import type { AuthResponse } from "@interwjuer/contracts";

import { ConflictError } from "../../shared/errors/app-error.js";
import type { AuthTokenService } from "../ports/auth-token.service.js";
import type { PasswordHasher } from "../ports/password-hasher.js";
import type { UserRepository } from "../ports/user.repository.js";

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export class EmailAlreadyRegisteredError extends ConflictError {
  constructor() {
    super("Unable to register with these credentials", {
      code: "REGISTRATION_FAILED",
    });
  }
}

export class RegisterUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: AuthTokenService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.toLowerCase();
    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyRegisteredError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.users.create({
      email,
      name: input.name?.trim() || null,
      passwordHash,
    });

    const accessToken = await this.tokens.signAccessToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
      expiresIn: this.tokens.getExpiresInSeconds(),
    };
  }
}
