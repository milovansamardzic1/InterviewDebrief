import type {
  ApplicationDetail,
  ApplicationListResponse,
  ApplicationStatus,
  CreateApplicationRequest,
  CreateInterviewRoundRequest,
  CreateQuestionRequest,
  CreateSkillEvaluationRequest,
  InterviewRoundResponse,
  QuestionResponse,
  SkillEvaluationResponse,
  UpdateApplicationRequest,
  UpdateInterviewRoundRequest,
  UpdateQuestionRequest,
  UpdateSkillEvaluationRequest,
} from "@interwjuer/contracts";

import { api, isNotFound } from "@/lib/api/client";

export type ListApplicationsOptions = {
  cursor?: string;
  search?: string;
  status?: ApplicationStatus;
  applicationSourceId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export const applicationsApi = {
  list(options: ListApplicationsOptions = {}) {
    const params = new URLSearchParams();

    if (options.cursor) params.set("cursor", options.cursor);
    if (options.search) params.set("search", options.search);
    if (options.status) params.set("status", options.status);
    if (options.applicationSourceId) {
      params.set("applicationSourceId", options.applicationSourceId);
    }
    if (options.dateFrom) params.set("dateFrom", options.dateFrom);
    if (options.dateTo) params.set("dateTo", options.dateTo);

    const query = params.toString();
    return api.get<ApplicationListResponse>(
      `/applications${query ? `?${query}` : ""}`,
    );
  },

  create(body: CreateApplicationRequest) {
    return api.post<ApplicationDetail>("/applications", body);
  },

  update(id: string, body: UpdateApplicationRequest) {
    return api.patch<ApplicationDetail>(`/applications/${id}`, body);
  },

  delete(id: string) {
    return api.delete(`/applications/${id}`);
  },

  async byId(id: string): Promise<ApplicationDetail | null> {
    try {
      return await api.get<ApplicationDetail>(`/applications/${id}`);
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }

      throw error;
    }
  },

  rounds: {
    create(applicationId: string, body: CreateInterviewRoundRequest) {
      return api.post<InterviewRoundResponse>(
        `/applications/${applicationId}/rounds`,
        body,
      );
    },

    update(
      applicationId: string,
      roundId: string,
      body: UpdateInterviewRoundRequest,
    ) {
      return api.patch<InterviewRoundResponse>(
        `/applications/${applicationId}/rounds/${roundId}`,
        body,
      );
    },

    delete(applicationId: string, roundId: string) {
      return api.delete(`/applications/${applicationId}/rounds/${roundId}`);
    },
  },

  questions: {
    create(
      applicationId: string,
      roundId: string,
      body: CreateQuestionRequest,
    ) {
      return api.post<QuestionResponse>(
        `/applications/${applicationId}/rounds/${roundId}/questions`,
        body,
      );
    },

    update(
      applicationId: string,
      roundId: string,
      questionId: string,
      body: UpdateQuestionRequest,
    ) {
      return api.patch<QuestionResponse>(
        `/applications/${applicationId}/rounds/${roundId}/questions/${questionId}`,
        body,
      );
    },

    delete(applicationId: string, roundId: string, questionId: string) {
      return api.delete(
        `/applications/${applicationId}/rounds/${roundId}/questions/${questionId}`,
      );
    },
  },

  skillEvaluations: {
    create(
      applicationId: string,
      roundId: string,
      body: CreateSkillEvaluationRequest,
    ) {
      return api.post<SkillEvaluationResponse>(
        `/applications/${applicationId}/rounds/${roundId}/skill-evaluations`,
        body,
      );
    },

    update(
      applicationId: string,
      roundId: string,
      evaluationId: string,
      body: UpdateSkillEvaluationRequest,
    ) {
      return api.patch<SkillEvaluationResponse>(
        `/applications/${applicationId}/rounds/${roundId}/skill-evaluations/${evaluationId}`,
        body,
      );
    },

    delete(applicationId: string, roundId: string, evaluationId: string) {
      return api.delete(
        `/applications/${applicationId}/rounds/${roundId}/skill-evaluations/${evaluationId}`,
      );
    },
  },
};
