import type {
  ApplicationSourceItem,
  InterviewTypeItem,
  SkillItem,
} from "@interwjuer/contracts";

import type { ReferenceDataRepository } from "../ports/reference-data.repository.js";

export class ListApplicationSourcesUseCase {
  constructor(private readonly repository: ReferenceDataRepository) {}

  async execute(): Promise<ApplicationSourceItem[]> {
    return this.repository.listApplicationSources();
  }
}

export class ListInterviewTypesUseCase {
  constructor(private readonly repository: ReferenceDataRepository) {}

  async execute(): Promise<InterviewTypeItem[]> {
    return this.repository.listInterviewTypes();
  }
}

export class ListSkillsUseCase {
  constructor(private readonly repository: ReferenceDataRepository) {}

  async execute(): Promise<SkillItem[]> {
    return this.repository.listSkills();
  }
}
