import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { ListLearningTasksUseCase } from "../../application/learning-tasks/use-cases/list-learning-tasks.use-case.js";
import type {
  CreateLearningTaskUseCase,
  DeleteLearningTaskUseCase,
  UpdateLearningTaskUseCase,
} from "../../application/learning-tasks/use-cases/mutate-learning-task.use-cases.js";
import type { AppVariables } from "../context.js";
import {
  CreateLearningTaskBodySchema,
  LearningTaskIdParamSchema,
  ListLearningTasksQuerySchema,
  UpdateLearningTaskBodySchema,
} from "../schemas/learning-tasks.schema.js";

export type LearningTasksRouteDeps = {
  listLearningTasks: ListLearningTasksUseCase;
  createLearningTask: CreateLearningTaskUseCase;
  updateLearningTask: UpdateLearningTaskUseCase;
  deleteLearningTask: DeleteLearningTaskUseCase;
};

export function createLearningTasksRoutes(deps: LearningTasksRouteDeps) {
  return new Hono<{ Variables: AppVariables }>()
    .get(
      "/",
      zValidator("query", ListLearningTasksQuerySchema),
      async (context) => {
        const { includeCompleted } = context.req.valid("query");
        const result = await deps.listLearningTasks.execute({
          userId: context.get("userId"),
          includeCompleted,
        });
        return context.json(result);
      },
    )
    .post(
      "/",
      zValidator("json", CreateLearningTaskBodySchema),
      async (context) => {
        const task = await deps.createLearningTask.execute({
          userId: context.get("userId"),
          ...context.req.valid("json"),
        });
        return context.json(task, 201);
      },
    )
    .patch(
      "/:id",
      zValidator("param", LearningTaskIdParamSchema),
      zValidator("json", UpdateLearningTaskBodySchema),
      async (context) => {
        const task = await deps.updateLearningTask.execute({
          id: context.req.valid("param").id,
          userId: context.get("userId"),
          ...context.req.valid("json"),
        });
        return context.json(task);
      },
    )
    .delete(
      "/:id",
      zValidator("param", LearningTaskIdParamSchema),
      async (context) => {
        await deps.deleteLearningTask.execute({
          id: context.req.valid("param").id,
          userId: context.get("userId"),
        });
        return context.body(null, 204);
      },
    );
}
