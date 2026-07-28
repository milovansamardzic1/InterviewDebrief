import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { ListQuestionHistoryUseCase } from "../../application/questions/use-cases/list-question-history.use-case.js";
import type { AppVariables } from "../context.js";
import { ListQuestionHistoryQuerySchema } from "../schemas/questions.schema.js";

export type QuestionsRouteDeps = {
  listQuestionHistory: ListQuestionHistoryUseCase;
};

export function createQuestionsRoutes(deps: QuestionsRouteDeps) {
  return new Hono<{ Variables: AppVariables }>().get(
    "/",
    zValidator("query", ListQuestionHistoryQuerySchema),
    async (c) => {
      const { limit, cursor, topic } = c.req.valid("query");
      const userId = c.get("userId");
      const history = await deps.listQuestionHistory.execute({
        userId,
        limit,
        cursor,
        topic,
      });
      return c.json(history);
    },
  );
}
