import type { RejectionInsightsRecord } from "../read-models/rejection-insights.record.js";

export interface RejectionInsightsRepository {
  getInsightsForUser(userId: string): Promise<RejectionInsightsRecord>;
}
