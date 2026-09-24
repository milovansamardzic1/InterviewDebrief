import type { RejectionCategory } from "@interwjuer/contracts";

export type RejectionCategoryCountRecord = {
  category: RejectionCategory | null;
  count: number;
};

export type RecentRejectionRecord = {
  applicationId: string;
  company: string;
  position: string;
  category: RejectionCategory | null;
  reason: string | null;
  applicationDate: Date;
};

export type RejectionInsightsRecord = {
  rejectedCount: number;
  categorizedCount: number;
  categoryBreakdown: RejectionCategoryCountRecord[];
  recentRejections: RecentRejectionRecord[];
};
