import { Prisma } from "@prisma/client";

import {
  ConflictError,
  NotFoundError,
} from "../../../application/shared/errors/app-error.js";
import type { Logger } from "../../logging/logger.js";

/**
 * Runs a Prisma operation, translating well-known Prisma errors into
 * application errors and logging anything unexpected. Keeps infrastructure
 * details (Prisma error codes) from leaking into the application layer.
 */
export async function runPrismaOperation<T>(
  operation: string,
  logger: Logger,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.warn("Prisma known request error", {
        operation,
        prismaCode: error.code,
        meta: error.meta,
      });

      if (error.code === "P2002") {
        throw new ConflictError("Resource already exists", {
          code: "UNIQUE_CONSTRAINT_VIOLATION",
          cause: error,
          details: { target: error.meta?.target },
        });
      }

      if (error.code === "P2025") {
        throw new NotFoundError("Resource not found", {
          code: "RECORD_NOT_FOUND",
          cause: error,
        });
      }
    }

    logger.error("Unexpected database error", { operation, error });
    throw error;
  }
}
