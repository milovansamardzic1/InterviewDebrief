export type LearningPlanRelatedQuestionRecord = {
  id: string;
  questionText: string;
  topic: string | null;
  applicationId: string;
  roundId: string;
  company: string;
};

export type LearningPlanItemRecord = {
  skillId: string;
  skillName: string;
  skillCategory: string | null;
  averageScore: number;
  evaluationCount: number;
  lastEvaluatedAt: Date;
  relatedQuestions: LearningPlanRelatedQuestionRecord[];
};
