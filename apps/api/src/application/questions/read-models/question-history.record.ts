export type QuestionHistoryRecord = {
  id: string;
  question: string;
  myAnswer: string | null;
  topic: string | null;
  difficulty: number | null;
  notes: string | null;
  applicationId: string;
  company: string;
  position: string;
  roundId: string;
  interviewTypeName: string;
};
