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
import {
  EmailAlreadyRegisteredError,
  RegisterUseCase,
} from "./register.use-case.js";

class FakeUserRepository implements UserRepository {
  users: AuthUserWithPasswordRecord[] = [];
  private nextId = 1;

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
    const user: AuthUserWithPasswordRecord = {
      id: `user-${this.nextId++}`,
      ...input,
    };
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

describe("RegisterUseCase", () => {
  let users: FakeUserRepository;
  let useCase: RegisterUseCase;

  beforeEach(() => {
    users = new FakeUserRepository();
    useCase = new RegisterUseCase(
      users,
      new FakePasswordHasher(),
      new FakeAuthTokenService(),
    );
  });

  it("throws EmailAlreadyRegisteredError when the email is already taken", async () => {
    users.users.push({
      id: "existing-user",
      email: "jane@example.com",
      name: "Jane",
      passwordHash: "hashed:secret",
    });

    await expect(
      useCase.execute({ email: "jane@example.com", password: "secret" }),
    ).rejects.toThrow(EmailAlreadyRegisteredError);
  });

  it("lowercases the email before storing", async () => {
    await useCase.execute({ email: "Jane@Example.com", password: "secret" });

    expect(users.users[0]?.email).toBe("jane@example.com");
  });

  it("trims the name and stores null when blank", async () => {
    await useCase.execute({
      email: "a@example.com",
      password: "secret",
      name: "   ",
    });
    expect(users.users[0]?.name).toBeNull();

    await useCase.execute({
      email: "b@example.com",
      password: "secret",
      name: "  Bob  ",
    });
    expect(users.users[1]?.name).toBe("Bob");
  });

  it("returns the access token and created user on success", async () => {
    const result = await useCase.execute({
      email: "a@example.com",
      password: "secret",
    });

    expect(result.user.email).toBe("a@example.com");
    expect(result.accessToken).toBe(`token:${result.user.id}`);
    expect(result.expiresIn).toBe(604800);
  });
});
