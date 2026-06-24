import type { AccessTokenVerifier } from "../application/auth/ports/access-token.verifier.js";
import type { AuthTokenService } from "../application/auth/ports/auth-token.service.js";
import { GetCurrentUserUseCase } from "../application/auth/use-cases/get-current-user.use-case.js";
import { LoginUseCase } from "../application/auth/use-cases/login.use-case.js";
import { RegisterUseCase } from "../application/auth/use-cases/register.use-case.js";
import { GetDashboardStatsUseCase } from "../application/dashboard/use-cases/get-dashboard-stats.use-case.js";
import {
  CreateInterviewRoundUseCase,
  DeleteInterviewRoundUseCase,
  UpdateInterviewRoundUseCase,
} from "../application/interview-rounds/use-cases/mutate-interview-round.use-cases.js";
import { GetApplicationByIdUseCase } from "../application/job-applications/use-cases/get-application-by-id.use-case.js";
import { ListApplicationsUseCase } from "../application/job-applications/use-cases/list-applications.use-case.js";
import {
  CreateApplicationUseCase,
  DeleteApplicationUseCase,
  UpdateApplicationUseCase,
} from "../application/job-applications/use-cases/mutate-application.use-cases.js";
import {
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
} from "../application/questions/use-cases/mutate-question.use-cases.js";
import {
  ListApplicationSourcesUseCase,
  ListInterviewTypesUseCase,
  ListSkillsUseCase,
} from "../application/reference-data/use-cases/list-reference-data.use-cases.js";
import {
  CreateSkillEvaluationUseCase,
  DeleteSkillEvaluationUseCase,
  UpdateSkillEvaluationUseCase,
} from "../application/skill-evaluations/use-cases/mutate-skill-evaluation.use-cases.js";
import { BcryptPasswordHasher } from "../infrastructure/auth/bcrypt-password-hasher.js";
import { JoseAuthTokenService } from "../infrastructure/auth/jose-auth-token.service.js";
import { prisma } from "../infrastructure/db/client.js";
import { logger, type Logger } from "../infrastructure/logging/logger.js";
import { PrismaDashboardRepository } from "../infrastructure/persistence/prisma/prisma-dashboard.repository.js";
import { PrismaInterviewRoundsRepository } from "../infrastructure/persistence/prisma/prisma-interview-rounds.repository.js";
import { PrismaJobApplicationsRepository } from "../infrastructure/persistence/prisma/prisma-job-applications.repository.js";
import { PrismaQuestionsRepository } from "../infrastructure/persistence/prisma/prisma-questions.repository.js";
import { PrismaReferenceDataRepository } from "../infrastructure/persistence/prisma/prisma-reference-data.repository.js";
import { PrismaSkillEvaluationsRepository } from "../infrastructure/persistence/prisma/prisma-skill-evaluations.repository.js";
import { PrismaUserRepository } from "../infrastructure/persistence/prisma/prisma-user.repository.js";

export type Container = {
  logger: Logger;
  accessTokenVerifier: AccessTokenVerifier;
  tokens: AuthTokenService;
  login: LoginUseCase;
  register: RegisterUseCase;
  getCurrentUser: GetCurrentUserUseCase;
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
  listApplicationSources: ListApplicationSourcesUseCase;
  listInterviewTypes: ListInterviewTypesUseCase;
  listSkills: ListSkillsUseCase;
  getDashboardStats: GetDashboardStatsUseCase;
};

export function createContainer(): Container {
  const passwordHasher = new BcryptPasswordHasher();
  const tokens = new JoseAuthTokenService();
  const userRepository = new PrismaUserRepository(prisma, logger);
  const jobApplicationsRepository = new PrismaJobApplicationsRepository(
    prisma,
    logger,
  );
  const interviewRoundsRepository = new PrismaInterviewRoundsRepository(
    prisma,
    logger,
  );
  const questionsRepository = new PrismaQuestionsRepository(prisma, logger);
  const skillEvaluationsRepository = new PrismaSkillEvaluationsRepository(
    prisma,
    logger,
  );
  const referenceDataRepository = new PrismaReferenceDataRepository(
    prisma,
    logger,
  );
  const dashboardRepository = new PrismaDashboardRepository(prisma, logger);

  return {
    logger,
    accessTokenVerifier: tokens,
    tokens,
    login: new LoginUseCase(userRepository, passwordHasher, tokens),
    register: new RegisterUseCase(userRepository, passwordHasher, tokens),
    getCurrentUser: new GetCurrentUserUseCase(userRepository),
    listApplications: new ListApplicationsUseCase(jobApplicationsRepository),
    getApplicationById: new GetApplicationByIdUseCase(
      jobApplicationsRepository,
    ),
    createApplication: new CreateApplicationUseCase(jobApplicationsRepository),
    updateApplication: new UpdateApplicationUseCase(jobApplicationsRepository),
    deleteApplication: new DeleteApplicationUseCase(jobApplicationsRepository),
    createInterviewRound: new CreateInterviewRoundUseCase(
      interviewRoundsRepository,
    ),
    updateInterviewRound: new UpdateInterviewRoundUseCase(
      interviewRoundsRepository,
    ),
    deleteInterviewRound: new DeleteInterviewRoundUseCase(
      interviewRoundsRepository,
    ),
    createQuestion: new CreateQuestionUseCase(questionsRepository),
    updateQuestion: new UpdateQuestionUseCase(questionsRepository),
    deleteQuestion: new DeleteQuestionUseCase(questionsRepository),
    createSkillEvaluation: new CreateSkillEvaluationUseCase(
      skillEvaluationsRepository,
    ),
    updateSkillEvaluation: new UpdateSkillEvaluationUseCase(
      skillEvaluationsRepository,
    ),
    deleteSkillEvaluation: new DeleteSkillEvaluationUseCase(
      skillEvaluationsRepository,
    ),
    listApplicationSources: new ListApplicationSourcesUseCase(
      referenceDataRepository,
    ),
    listInterviewTypes: new ListInterviewTypesUseCase(referenceDataRepository),
    listSkills: new ListSkillsUseCase(referenceDataRepository),
    getDashboardStats: new GetDashboardStatsUseCase(dashboardRepository),
  };
}
