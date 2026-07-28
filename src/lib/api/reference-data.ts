import type {
  ApplicationSourceItem,
  InterviewTypeItem,
  SkillItem,
} from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export const referenceDataApi = {
  applicationSources() {
    return api.get<ApplicationSourceItem[]>("/application-sources");
  },

  interviewTypes() {
    return api.get<InterviewTypeItem[]>("/interview-types");
  },

  skills() {
    return api.get<SkillItem[]>("/skills");
  },
};
