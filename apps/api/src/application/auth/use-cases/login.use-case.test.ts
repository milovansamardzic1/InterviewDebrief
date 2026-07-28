import { beforeEach, describe, expect, it } from "vitest";

import type {
  AccessTokenPayload,
  AuthTokenService,
} from "../ports/auth-token.service.js";
import type { PasswordHasher } from "../ports/password-hasher.js";
import type {
  AuthUserWithPasswordRecord,
  UserRepository,
} from "../ports/user.repository.js";
import { LoginUseCase } from "./login.use-case.js";

const EXISTING_USER: AuthUserWithPasswordRecord = {
  id: "user-1",
  email: "jane@example.com",
  name: "Jane",
  passwordHash: "hashed:correct-password",
};

class FakeUserRepository implements UserRepository {
  constructor(private readonly users: AuthUserWithPasswordRecord[] = []) {}

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findById(id: string) {
    const user = this.users.find((candidate) => candidate.id === id);
    return user ? { id: user.id, email: user.email, name: user.name } : null;
  }

  async create(input: {
    email: string;
    name: string | null;
    passwordHash: string;
  }) {
    const user = { id: "new-user", ...input };
    this.users.push(user);
    return { id: user.id, email: user.email, name: user.name };
  }
}

class FakePasswordHasher implements PasswordHasher {
  async hash(password: string) {
    return `hashed:${password}`;
  }

  async verify(password: string, hash: string) {
    return `hashed:${password}` === hash;
  }
}

class FakeAuthTokenService implements AuthTokenService {
  async signAccessToken(payload: AccessTokenPayload) {
    return `token:${payload.userId}`;
  }

  async verifyAccessToken() {
    return null;
  }

  getExpiresInSeconds() {
    return 604800;
  }
}

describe("LoginUseCase", () => {
  let users: FakeUserRepository;
  let useCase: LoginUseCase;

  beforeEach(() => {
    users = new FakeUserRepository([EXISTING_USER]);
    useCase = new LoginUseCase(
      users,
      new FakePasswordHasher(),
      new FakeAuthTokenService(),
    );
  });

  it("returns null for an unknown email", async () => {
    const result = await useCase.execute({
      email: "unknown@example.com",
      password: "correct-password",
    });

    expect(result).toBeNull();
  });

  it("returns null for a wrong password", async () => {
    const result = await useCase.execute({
      email: EXISTING_USER.email,
      password: "wrong-password",
    });

    expect(result).toBeNull();
  });

  it("returns the access token and user on success", async () => {
    const result = await useCase.execute({
      email: EXISTING_USER.email,
      password: "correct-password",
    });

    expect(result).toEqual({
      user: {
        id: EXISTING_USER.id,
        email: EXISTING_USER.email,
        name: EXISTING_USER.name,
      },
      accessToken: `token:${EXISTING_USER.id}`,
      expiresIn: 604800,
    });
  });

  it("matches email case-insensitively", async () => {
    const result = await useCase.execute({
      email: "JANE@example.com",
      password: "correct-password",
    });

    expect(result).not.toBeNull();
  });
});
