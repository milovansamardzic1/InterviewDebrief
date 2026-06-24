export type WeakSkillRecord = {
  skillId: string;
  skillName: string;
  skillCategory: string | null;
  averageScore: number;
  evaluationCount: number;
};

export type TopicCountRecord = {
  topic: string;
  count: number;
};

export type StatusCountRecord = {
  status: string;
  count: number;
};

export type MonthlyProgressRecord = {
  month: string;
  completedRounds: number;
};

export type DashboardStatsRecord = {
  jobApplications: number;
  interviewRounds: number;
  questions: number;
  skillEvaluations: number;
  skills: number;
  weakSkills: WeakSkillRecord[];
  questionsByTopic: TopicCountRecord[];
  statusBreakdown: StatusCountRecord[];
  progressOverTime: MonthlyProgressRecord[];
};

export type GetDashboardStatsOptions = {
  userId: string;
};

export interface DashboardRepository {
  getStats(options: GetDashboardStatsOptions): Promise<DashboardStatsRecord>;
}
