import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import {
  isAppError,
  type ErrorCategory,
} from "../../application/shared/errors/app-error.js";
import type { Logger } from "../../infrastructure/logging/logger.js";
import type { AppVariables } from "../context.js";

const CATEGORY_STATUS: Record<ErrorCategory, ContentfulStatusCode> = {
  VALIDATION: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
};

type ErrorBody = {
  error: string;
  code: string;
  requestId?: string;
  details?: unknown;
};

/**
 * Centralized error -> HTTP response translation for `app.onError`.
 * Expected (operational) `AppError`s are surfaced to the client; everything
 * else is logged with full detail and returned as a generic 500 so internals
 * never leak.
 */
export function handleError(
  error: unknown,
  c: Context<{ Variables: AppVariables }>,
  fallbackLogger: Logger,
): Response {
  const logger = c.get("logger") ?? fallbackLogger;
  const requestId = c.get("requestId");

  if (isAppError(error)) {
    const status = CATEGORY_STATUS[error.category];

    const logContext = {
      code: error.code,
      category: error.category,
      path: c.req.path,
      method: c.req.method,
      error,
    };

    if (status >= 500) {
      logger.error(error.message, logContext);
    } else {
      logger.warn(error.message, logContext);
    }

    const body: ErrorBody = {
      error: error.message,
      code: error.code,
      ...(requestId ? { requestId } : {}),
      ...(error.details !== undefined ? { details: error.details } : {}),
    };

    return c.json(body, status);
  }

  logger.error("Unhandled error", {
    path: c.req.path,
    method: c.req.method,
    error,
  });

  const body: ErrorBody = {
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    ...(requestId ? { requestId } : {}),
  };

  return c.json(body, 500);
}
