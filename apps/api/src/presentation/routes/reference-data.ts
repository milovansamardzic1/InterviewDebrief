import { Hono } from "hono";

import type { ListApplicationSourcesUseCase } from "../../application/reference-data/use-cases/list-reference-data.use-cases.js";
import type { ListInterviewTypesUseCase } from "../../application/reference-data/use-cases/list-reference-data.use-cases.js";
import type { ListSkillsUseCase } from "../../application/reference-data/use-cases/list-reference-data.use-cases.js";
import type { AppVariables } from "../context.js";

export type ReferenceDataRouteDeps = {
  listApplicationSources: ListApplicationSourcesUseCase;
  listInterviewTypes: ListInterviewTypesUseCase;
  listSkills: ListSkillsUseCase;
};

export function createReferenceDataRoutes(deps: ReferenceDataRouteDeps) {
  return new Hono<{ Variables: AppVariables }>()
    .get("/application-sources", async (c) => {
      const sources = await deps.listApplicationSources.execute();
      return c.json(sources);
    })
    .get("/interview-types", async (c) => {
      const types = await deps.listInterviewTypes.execute();
      return c.json(types);
    })
    .get("/skills", async (c) => {
      const skills = await deps.listSkills.execute();
      return c.json(skills);
    });
}
