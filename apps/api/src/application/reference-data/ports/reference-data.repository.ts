import type {
  ApplicationSourceItem,
  InterviewTypeItem,
  SkillItem,
} from "@interwjuer/contracts";

export interface ReferenceDataRepository {
  listApplicationSources(): Promise<ApplicationSourceItem[]>;
  listInterviewTypes(): Promise<InterviewTypeItem[]>;
  listSkills(): Promise<SkillItem[]>;
}
