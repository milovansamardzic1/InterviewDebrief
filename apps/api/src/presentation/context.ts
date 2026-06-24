import type { Logger } from "../infrastructure/logging/logger.js";

export type AppVariables = {
  userId: string;
  requestId: string;
  logger: Logger;
};
