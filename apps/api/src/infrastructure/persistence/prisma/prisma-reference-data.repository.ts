import type { PrismaClient } from "@prisma/client";

import type { ReferenceDataRepository } from "../../../application/reference-data/ports/reference-data.repository.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

export class PrismaReferenceDataRepository implements ReferenceDataRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async listApplicationSources() {
    return runPrismaOperation(
      "referenceData.listApplicationSources",
      this.logger,
      () =>
        this.db.applicationSource.findMany({
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
    );
  }

  async listInterviewTypes() {
    return runPrismaOperation(
      "referenceData.listInterviewTypes",
      this.logger,
      () =>
        this.db.interviewType.findMany({
          orderBy: { name: "asc" },
          select: { id: true, name: true, description: true },
        }),
    );
  }

  async listSkills() {
    return runPrismaOperation(
      "referenceData.listSkills",
      this.logger,
      () =>
        this.db.skill.findMany({
          orderBy: [{ category: "asc" }, { name: "asc" }],
          select: { id: true, name: true, category: true },
        }),
    );
  }
}
