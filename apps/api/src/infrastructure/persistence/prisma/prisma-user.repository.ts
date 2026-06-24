import type { PrismaClient } from "@prisma/client";

import type {
  AuthUserRecord,
  AuthUserWithPasswordRecord,
  UserRepository,
} from "../../../application/auth/ports/user.repository.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

const authUserSelect = {
  id: true,
  email: true,
  name: true,
} as const;

const authUserWithPasswordSelect = {
  ...authUserSelect,
  passwordHash: true,
} as const;

export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async findByEmail(email: string): Promise<AuthUserWithPasswordRecord | null> {
    return runPrismaOperation("user.findByEmail", this.logger, () =>
      this.db.user.findUnique({
        where: { email },
        select: authUserWithPasswordSelect,
      }),
    );
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    return runPrismaOperation("user.findById", this.logger, () =>
      this.db.user.findUnique({
        where: { id },
        select: authUserSelect,
      }),
    );
  }

  async create(input: {
    email: string;
    name: string | null;
    passwordHash: string;
  }): Promise<AuthUserRecord> {
    return runPrismaOperation("user.create", this.logger, () =>
      this.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash: input.passwordHash,
        },
        select: authUserSelect,
      }),
    );
  }
}
