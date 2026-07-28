import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { NotFoundError } from "../../application/shared/errors/app-error.js";
import type { CreateApplicationUseCase } from "../../application/job-applications/use-cases/mutate-application.use-cases.js";
import type { DeleteApplicationUseCase } from "../../application/job-applications/use-cases/mutate-application.use-cases.js";
import type { UpdateApplicationUseCase } from "../../application/job-applications/use-cases/mutate-application.use-cases.js";
import type { GetApplicationByIdUseCase } from "../../application/job-applications/use-cases/get-application-by-id.use-case.js";
import type { ListApplicationsUseCase } from "../../application/job-applications/use-cases/list-applications.use-case.js";
import type { CreateInterviewRoundUseCase } from "../../application/interview-rounds/use-cases/mutate-interview-round.use-cases.js";
import type { DeleteInterviewRoundUseCase } from "../../application/interview-rounds/use-cases/mutate-interview-round.use-cases.js";
import type { UpdateInterviewRoundUseCase } from "../../application/interview-rounds/use-cases/mutate-interview-round.use-cases.js";
import type { CreateQuestionUseCase } from "../../application/questions/use-cases/mutate-question.use-cases.js";
import type { DeleteQuestionUseCase } from "../../application/questions/use-cases/mutate-question.use-cases.js";
import type { UpdateQuestionUseCase } from "../../application/questions/use-cases/mutate-question.use-cases.js";
import type { CreateSkillEvaluationUseCase } from "../../application/skill-evaluations/use-cases/mutate-skill-evaluation.use-cases.js";
import type { DeleteSkillEvaluationUseCase } from "../../application/skill-evaluations/use-cases/mutate-skill-evaluation.use-cases.js";
import type { UpdateSkillEvaluationUseCase } from "../../application/skill-evaluations/use-cases/mutate-skill-evaluation.use-cases.js";
import type { AppVariables } from "../context.js";
import {
  ApplicationIdOnlyParamSchema,
  ApplicationIdParamSchema,
  ApplicationRoundParamsSchema,
  ApplicationRoundQuestionParamsSchema,
  ApplicationRoundSkillEvaluationParamsSchema,
  CreateApplicationBodySchema,
  CreateInterviewRoundBodySchema,
  CreateQuestionBodySchema,
  CreateSkillEvaluationBodySchema,
  ListApplicationsQuerySchema,
  UpdateApplicationBodySchema,
  UpdateInterviewRoundBodySchema,
  UpdateQuestionBodySchema,
  UpdateSkillEvaluationBodySchema,
} from "../schemas/job-applications.schema.js";

export type ApplicationsRouteDeps = {
  listApplications: ListApplicationsUseCase;
  getApplicationById: GetApplicationByIdUseCase;
  createApplication: CreateApplicationUseCase;
  updateApplication: UpdateApplicationUseCase;
  deleteApplication: DeleteApplicationUseCase;
  createInterviewRound: CreateInterviewRoundUseCase;
  updateInterviewRound: UpdateInterviewRoundUseCase;
  deleteInterviewRound: DeleteInterviewRoundUseCase;
  createQuestion: CreateQuestionUseCase;
  updateQuestion: UpdateQuestionUseCase;
  deleteQuestion: DeleteQuestionUseCase;
  createSkillEvaluation: CreateSkillEvaluationUseCase;
  updateSkillEvaluation: UpdateSkillEvaluationUseCase;
  deleteSkillEvaluation: DeleteSkillEvaluationUseCase;
};

export function createApplicationsRoutes(deps: ApplicationsRouteDeps) {
  return new Hono<{ Variables: AppVariables }>()
    .get("/", zValidator("query", ListApplicationsQuerySchema), async (c) => {
      const {
        limit,
        cursor,
        search,
        status,
        applicationSourceId,
        dateFrom,
        dateTo,
      } = c.req.valid("query");
      const userId = c.get("userId");
      const applications = await deps.listApplications.execute({
        userId,
        limit,
        cursor,
        search,
        status,
        applicationSourceId,
        dateFrom,
        dateTo,
      });
      return c.json(applications);
    })
    .post("/", zValidator("json", CreateApplicationBodySchema), async (c) => {
      const body = c.req.valid("json");
      const userId = c.get("userId");
      const application = await deps.createApplication.execute({
        userId,
        ...body,
      });
      return c.json(application, 201);
    })
    .get("/:id", zValidator("param", ApplicationIdParamSchema), async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("userId");
      const application = await deps.getApplicationById.execute({
        id,
        userId,
      });

      if (!application) {
        throw new NotFoundError("Application not found", {
          code: "APPLICATION_NOT_FOUND",
        });
      }

      return c.json(application);
    })
    .patch(
      "/:id",
      zValidator("param", ApplicationIdParamSchema),
      zValidator("json", UpdateApplicationBodySchema),
      async (c) => {
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const application = await deps.updateApplication.execute({
          id,
          userId,
          ...body,
        });
        return c.json(application);
      },
    )
    .delete(
      "/:id",
      zValidator("param", ApplicationIdParamSchema),
      async (c) => {
        const { id } = c.req.valid("param");
        const userId = c.get("userId");
        await deps.deleteApplication.execute({ id, userId });
        return c.body(null, 204);
      },
    )
    .post(
      "/:applicationId/rounds",
      zValidator("param", ApplicationIdOnlyParamSchema),
      zValidator("json", CreateInterviewRoundBodySchema),
      async (c) => {
        const { applicationId } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const round = await deps.createInterviewRound.execute({
          applicationId,
          userId,
          ...body,
        });
        return c.json(round, 201);
      },
    )
    .patch(
      "/:applicationId/rounds/:roundId",
      zValidator("param", ApplicationRoundParamsSchema),
      zValidator("json", UpdateInterviewRoundBodySchema),
      async (c) => {
        const { applicationId, roundId } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const round = await deps.updateInterviewRound.execute({
          applicationId,
          roundId,
          userId,
          ...body,
        });
        return c.json(round);
      },
    )
    .delete(
      "/:applicationId/rounds/:roundId",
      zValidator("param", ApplicationRoundParamsSchema),
      async (c) => {
        const { applicationId, roundId } = c.req.valid("param");
        const userId = c.get("userId");
        await deps.deleteInterviewRound.execute({
          applicationId,
          roundId,
          userId,
        });
        return c.body(null, 204);
      },
    )
    .post(
      "/:applicationId/rounds/:roundId/questions",
      zValidator("param", ApplicationRoundParamsSchema),
      zValidator("json", CreateQuestionBodySchema),
      async (c) => {
        const { applicationId, roundId } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const question = await deps.createQuestion.execute({
          applicationId,
          roundId,
          userId,
          ...body,
        });
        return c.json(question, 201);
      },
    )
    .patch(
      "/:applicationId/rounds/:roundId/questions/:questionId",
      zValidator("param", ApplicationRoundQuestionParamsSchema),
      zValidator("json", UpdateQuestionBodySchema),
      async (c) => {
        const { applicationId, roundId, questionId } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const question = await deps.updateQuestion.execute({
          applicationId,
          roundId,
          questionId,
          userId,
          ...body,
        });
        return c.json(question);
      },
    )
    .delete(
      "/:applicationId/rounds/:roundId/questions/:questionId",
      zValidator("param", ApplicationRoundQuestionParamsSchema),
      async (c) => {
        const { applicationId, roundId, questionId } = c.req.valid("param");
        const userId = c.get("userId");
        await deps.deleteQuestion.execute({
          applicationId,
          roundId,
          questionId,
          userId,
        });
        return c.body(null, 204);
      },
    )
    .post(
      "/:applicationId/rounds/:roundId/skill-evaluations",
      zValidator("param", ApplicationRoundParamsSchema),
      zValidator("json", CreateSkillEvaluationBodySchema),
      async (c) => {
        const { applicationId, roundId } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const evaluation = await deps.createSkillEvaluation.execute({
          applicationId,
          roundId,
          userId,
          ...body,
        });
        return c.json(evaluation, 201);
      },
    )
    .patch(
      "/:applicationId/rounds/:roundId/skill-evaluations/:evaluationId",
      zValidator("param", ApplicationRoundSkillEvaluationParamsSchema),
      zValidator("json", UpdateSkillEvaluationBodySchema),
      async (c) => {
        const { applicationId, roundId, evaluationId } = c.req.valid("param");
        const body = c.req.valid("json");
        const userId = c.get("userId");
        const evaluation = await deps.updateSkillEvaluation.execute({
          applicationId,
          roundId,
          evaluationId,
          userId,
          ...body,
        });
        return c.json(evaluation);
      },
    )
    .delete(
      "/:applicationId/rounds/:roundId/skill-evaluations/:evaluationId",
      zValidator("param", ApplicationRoundSkillEvaluationParamsSchema),
      async (c) => {
        const { applicationId, roundId, evaluationId } = c.req.valid("param");
        const userId = c.get("userId");
        await deps.deleteSkillEvaluation.execute({
          applicationId,
          roundId,
          evaluationId,
          userId,
        });
        return c.body(null, 204);
      },
    );
}
