import { describe, expect, it } from "vitest";

import type {
  CreateApplicationData,
  FindApplicationByIdOptions,
  FindManyApplicationsOptions,
  JobApplicationsRepository,
  UpdateApplicationData,
} from "../ports/job-applications.repository.js";
import type { ApplicationListRecord } from "../read-models/application-list.record.js";
import { ListApplicationsUseCase } from "./list-applications.use-case.js";

const RECORD: ApplicationListRecord = {
  id: "application-1",
  company: "Acme",
  position: "Engineer",
  location: null,
  applicationStatus: "APPLIED",
  applicationDate: new Date("2024-01-01"),
  salaryMin: null,
  salaryMax: null,
  sourceName: "LinkedIn",
  rounds: [
    {
      id: "round-1",
      sortOrder: 0,
      status: "SCHEDULED",
      scheduledAt: null,
      interviewTypeName: "Technical",
      questionCount: 3,
    },
    {
      id: "round-2",
      sortOrder: 1,
      status: "COMPLETED",
      scheduledAt: null,
      interviewTypeName: "Behavioral",
      questionCount: 2,
    },
  ],
};

class FakeJobApplicationsRepository implements JobApplicationsRepository {
  constructor(private readonly records: ApplicationListRecord[]) {}

  async findManyForList(_options: FindManyApplicationsOptions) {
    return { items: this.records, nextCursor: null as string | null };
  }

  async findDetailById(_id: string, _options: FindApplicationByIdOptions) {
    return null;
  }

  async existsForUser() {
    return false;
  }

  async create(_data: CreateApplicationData): Promise<never> {
    throw new Error("not implemented");
  }

  async update(_id: string, _userId: string, _data: UpdateApplicationData) {
    return null;
  }

  async delete() {
    return false;
  }
}

describe("ListApplicationsUseCase", () => {
  it("aggregates roundCount and totalQuestions from the rounds", async () => {
    const useCase = new ListApplicationsUseCase(
      new FakeJobApplicationsRepository([RECORD]),
    );

    const result = await useCase.execute({ userId: "user-1" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      roundCount: 2,
      totalQuestions: 5,
    });
  });

  it("returns totalQuestions of 0 for an application with no rounds", async () => {
    const useCase = new ListApplicationsUseCase(
      new FakeJobApplicationsRepository([{ ...RECORD, rounds: [] }]),
    );

    const result = await useCase.execute({ userId: "user-1" });

    expect(result.items[0]).toMatchObject({ roundCount: 0, totalQuestions: 0 });
  });

  it("passes through the nextCursor", async () => {
    class CursorRepository extends FakeJobApplicationsRepository {
      async findManyForList() {
        return { items: [], nextCursor: "cursor-abc" };
      }
    }
    const useCase = new ListApplicationsUseCase(new CursorRepository([]));

    const result = await useCase.execute({ userId: "user-1" });

    expect(result.nextCursor).toBe("cursor-abc");
  });
});
