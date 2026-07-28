import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

import { serve } from "@hono/node-server";

import { createApp } from "./composition/create-app.js";
import { createContainer } from "./composition/container.js";
import { loadEnv } from "./infrastructure/config/env.js";
import { logger } from "./infrastructure/logging/logger.js";

// Local dev keeps a single `.env` at the monorepo root (shared with the web
// app). Real deployments inject env vars directly, so a missing file here
// must never crash the process.
function loadRootEnvFile() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    // apps/api/src → root, or apps/api/dist → root
    path.resolve(here, "../../../.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      loadEnvFile(candidate);
      return;
    }
  }
}

loadRootEnvFile();

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { error: reason });
});

function start() {
  try {
    const env = loadEnv();
    const container = createContainer();
    const app = createApp(container);

    serve({ fetch: app.fetch, port: env.API_PORT }, (info) => {
      logger.info("API started", { port: info.port });
    });
  } catch (error) {
    logger.error("Failed to start API", { error });
    process.exit(1);
  }
}

start();
