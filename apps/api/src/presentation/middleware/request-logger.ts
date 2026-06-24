import { randomUUID } from "node:crypto";

import { createMiddleware } from "hono/factory";

import type { Logger } from "../../infrastructure/logging/logger.js";
import type { AppVariables } from "../context.js";

const REQUEST_ID_HEADER = "x-request-id";

/**
 * Assigns a request id, exposes a request-scoped child logger on the context,
 * and logs the outcome (status + duration) of every request. Failures thrown
 * further down the stack are logged by the centralized error handler.
 */
export function createRequestLogger(logger: Logger) {
  return createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
    const requestId = c.req.header(REQUEST_ID_HEADER) ?? randomUUID();
    const requestLogger = logger.child({ requestId });

    c.set("requestId", requestId);
    c.set("logger", requestLogger);
    c.header(REQUEST_ID_HEADER, requestId);

    const startedAt = Date.now();
    const { method } = c.req;
    const { path } = c.req;

    requestLogger.info("Request received", { method, path });

    await next();

    requestLogger.info("Request completed", {
      method,
      path,
      status: c.res.status,
      durationMs: Date.now() - startedAt,
    });
  });
}
