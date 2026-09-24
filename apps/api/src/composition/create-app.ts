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
import { createLearningPlanRoutes } from "../presentation/routes/learning-plan.js";
import { createLearningTasksRoutes } from "../presentation/routes/learning-tasks.js";
import { createQuestionsRoutes } from "../presentation/routes/questions.js";
import { createRejectionInsightsRoutes } from "../presentation/routes/rejection-insights.js";
import { createReferenceDataRoutes } from "../presentation/routes/reference-data.js";
import type { AppVariables } from "../presentation/context.js";
import { handleError } from "../presentation/lib/handle-error.js";
import { createAuthMiddleware } from "../presentation/middleware/auth.js";
import { createRequestLogger } from "../presentation/middleware/request-logger.js";
import type { Container } from "./container.js";

function getAllowedOrigins() {
  const env = loadEnv();
  const configured = env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const origins = new Set([
    "http://localhost:3000",
    "http://192.168.0.10:3000",
    ...(configured ? [configured] : []),
  ]);

  return [...origins];
}

export function createApp(container: Container) {
  const app = new Hono<{ Variables: AppVariables }>();
  const allowedOrigins = getAllowedOrigins();

  app.use("*", createRequestLogger(container.logger));
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin: allowedOrigins,
      allowMethods: [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
      ],
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
  protectedApi.route("/learning-plan", createLearningPlanRoutes(container));
  protectedApi.route("/learning-tasks", createLearningTasksRoutes(container));
  protectedApi.route(
    "/rejection-insights",
    createRejectionInsightsRoutes(container),
  );
  protectedApi.route("/", createReferenceDataRoutes(container));
  app.route("/", protectedApi);

  app.onError((error, c) => handleError(error, c, container.logger));

  app.notFound((c) => c.json({ error: "Not found", code: "NOT_FOUND" }, 404));

  return app;
}
