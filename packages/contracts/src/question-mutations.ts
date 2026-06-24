import type { ApplicationDetailQuestion } from "./job-applications.js";

export type CreateQuestionRequest = {
  question: string;
  myAnswer?: string | null;
  topic?: string | null;
  difficulty?: number | null;
  notes?: string | null;
};

export type UpdateQuestionRequest = {
  question?: string;
  myAnswer?: string | null;
  topic?: string | null;
  difficulty?: number | null;
  notes?: string | null;
};

export type QuestionResponse = ApplicationDetailQuestion;
