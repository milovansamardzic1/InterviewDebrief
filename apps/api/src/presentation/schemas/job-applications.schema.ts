import { z } from "zod";

const cuid = z.string().cuid();

const ApplicationStatusSchema = z.enum([
  "APPLIED",
  "SCREENING",
  "INTERVIEWING",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

const RejectionCategorySchema = z.enum([
  "TECHNICAL_SKILLS",
  "SYSTEM_DESIGN",
  "PROBLEM_SOLVING",
  "COMMUNICATION",
  "EXPERIENCE_FIT",
  "COMPENSATION",
  "POSITION_CLOSED",
  "OTHER",
]);

const InterviewRoundStatusSchema = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);
const scoreRange = z.number().int().min(1).max(5);
const difficultyRange = z.number().int().min(1).max(5).nullable().optional();

export const ApplicationIdParamSchema = z.object({
  id: cuid,
});

export const ApplicationIdOnlyParamSchema = z.object({
  applicationId: cuid,
});

export type ApplicationIdParam = z.infer<typeof ApplicationIdParamSchema>;

export const ListApplicationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: cuid.optional(),
  search: z.string().trim().min(1).max(200).optional(),
  status: ApplicationStatusSchema.optional(),
  applicationSourceId: cuid.optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type ListApplicationsQuery = z.infer<typeof ListApplicationsQuerySchema>;

export const CreateApplicationBodySchema = z.object({
  company: z.string().trim().min(1).max(200),
  position: z.string().trim().min(1).max(200),
  applicationSourceId: cuid,
  applicationDate: z.coerce.date(),
  location: z.string().trim().max(200).nullable().optional(),
  salaryMin: z.number().int().min(0).nullable().optional(),
  salaryMax: z.number().int().min(0).nullable().optional(),
  jobPostingUrl: z.string().url().nullable().optional(),
  jobDescription: z.string().max(10000).nullable().optional(),
  applicationStatus: ApplicationStatusSchema.optional(),
  rejectionCategory: RejectionCategorySchema.nullable().optional(),
  rejectionReason: z.string().max(10000).nullable().optional(),
  notes: z.string().max(10000).nullable().optional(),
});

export const UpdateApplicationBodySchema =
  CreateApplicationBodySchema.partial();

export const ApplicationRoundParamsSchema = z.object({
  applicationId: cuid,
  roundId: cuid,
});

export const ApplicationRoundQuestionParamsSchema =
  ApplicationRoundParamsSchema.extend({
    questionId: cuid,
  });

export const ApplicationRoundSkillEvaluationParamsSchema =
  ApplicationRoundParamsSchema.extend({
    evaluationId: cuid,
  });

export const CreateInterviewRoundBodySchema = z.object({
  interviewTypeId: cuid,
  sortOrder: z.number().int().min(0).optional(),
  status: InterviewRoundStatusSchema.optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
  notes: z.string().max(10000).nullable().optional(),
});

export const UpdateInterviewRoundBodySchema = z.object({
  interviewTypeId: cuid.optional(),
  sortOrder: z.number().int().min(0).optional(),
  status: InterviewRoundStatusSchema.optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
  notes: z.string().max(10000).nullable().optional(),
});

export const CreateQuestionBodySchema = z.object({
  question: z.string().trim().min(1).max(10000),
  myAnswer: z.string().max(10000).nullable().optional(),
  topic: z.string().trim().max(200).nullable().optional(),
  difficulty: difficultyRange,
  notes: z.string().max(10000).nullable().optional(),
});

export const UpdateQuestionBodySchema = CreateQuestionBodySchema.partial();

export const CreateSkillEvaluationBodySchema = z.object({
  skillId: cuid,
  score: scoreRange,
  notes: z.string().max(10000).nullable().optional(),
});

export const UpdateSkillEvaluationBodySchema = z.object({
  score: scoreRange.optional(),
  notes: z.string().max(10000).nullable().optional(),
});
