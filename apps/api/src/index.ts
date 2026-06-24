import { serve } from "@hono/node-server";

import { createApp } from "./composition/create-app.js";
import { createContainer } from "./composition/container.js";
import { loadEnv } from "./infrastructure/config/env.js";
import { logger } from "./infrastructure/logging/logger.js";

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
