import type { ApplicationListItem } from "./job-applications.js";

export type ApplicationListResponse = {
  items: ApplicationListItem[];
  nextCursor: string | null;
};
