import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import { loadEnv } from "../infrastructure/config/env.js";
import { createApplicationsRoutes } from "../presentation/routes/applications.js";
import {
  createProtectedAuthRoutes,
  createPublicAuthRoutes,
} from "../presentation/routes/auth.js";
import { createDashboardRoutes } from "../presentation/routes/dashboard.js";
import { createQuestionsRoutes } from "../presentation/routes/questions.js";
import { createReferenceDataRoutes } from "../presentation/routes/reference-data.js";
import type { AppVariables } from "../presentation/context.js";
import { handleError } from "../presentation/lib/handle-error.js";
import { createAuthMiddleware } from "../presentation/middleware/auth.js";
import { createRequestLogger } from "../presentation/middleware/request-logger.js";
import type { Container } from "./container.js";

function getAllowedOrigin() {
  const env = loadEnv();
  return env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export function createApp(container: Container) {
  const app = new Hono<{ Variables: AppVariables }>();

  app.use("*", createRequestLogger(container.logger));
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin: getAllowedOrigin(),
      allowMethods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  app.get("/health", (c) => c.json({ status: "ok" }));
  app.route("/auth", createPublicAuthRoutes(container));

  const protectedApi = new Hono<{ Variables: AppVariables }>();
  protectedApi.use("*", createAuthMiddleware(container.accessTokenVerifier));
  protectedApi.route("/auth", createProtectedAuthRoutes(container));
  protectedApi.route("/applications", createApplicationsRoutes(container));
  protectedApi.route("/dashboard", createDashboardRoutes(container));
  protectedApi.route("/questions", createQuestionsRoutes(container));
  protectedApi.route("/", createReferenceDataRoutes(container));
  app.route("/", protectedApi);

  app.onError((error, c) => handleError(error, c, container.logger));

  app.notFound((c) => c.json({ error: "Not found", code: "NOT_FOUND" }, 404));

  return app;
}
