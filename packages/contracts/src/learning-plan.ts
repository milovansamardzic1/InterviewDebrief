export type LearningPlanRelatedQuestion = {
  id: string;
  questionText: string;
  topic: string | null;
  applicationId: string;
  roundId: string;
  company: string;
};

export type LearningPlanItem = {
  skillId: string;
  skillName: string;
  skillCategory: string | null;
  averageScore: number;
  evaluationCount: number;
  lastEvaluatedAt: string;
  focusHint: string;
  relatedQuestions: LearningPlanRelatedQuestion[];
};

export type LearningPlanResponse = {
  items: LearningPlanItem[];
  generatedAt: string;
};
