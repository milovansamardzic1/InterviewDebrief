import type {
  ApplicationDetail,
  ApplicationListResponse,
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

export const applicationsApi = {
  list(cursor?: string) {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    return api.get<ApplicationListResponse>(`/applications${query}`);
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
