import type { RejectionCategory } from "./enums.js";

export type RejectionCategoryCount = {
  category: RejectionCategory | null;
  count: number;
};

export type RecentRejection = {
  applicationId: string;
  company: string;
  position: string;
  category: RejectionCategory | null;
  reason: string | null;
  applicationDate: string;
};

export type RejectionInsightsResponse = {
  rejectedCount: number;
  categorizedCount: number;
  categoryBreakdown: RejectionCategoryCount[];
  recentRejections: RecentRejection[];
  generatedAt: string;
};
