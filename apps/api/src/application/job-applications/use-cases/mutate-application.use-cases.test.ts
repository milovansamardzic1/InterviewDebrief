import type { ApplicationDetail } from "@interwjuer/contracts";
import { describe, expect, it } from "vitest";

import { NotFoundError } from "../../shared/errors/app-error.js";
import type {
  CreateApplicationData,
  JobApplicationsRepository,
  UpdateApplicationData,
} from "../ports/job-applications.repository.js";
import {
  CreateApplicationUseCase,
  DeleteApplicationUseCase,
  UpdateApplicationUseCase,
} from "./mutate-application.use-cases.js";

const APPLICATION_ID = "application-1";
const USER_ID = "user-1";

function toDetail(
  overrides: Partial<ApplicationDetail> = {},
): ApplicationDetail {
  return {
    id: APPLICATION_ID,
    company: "Acme",
    position: "Engineer",
    location: null,
    applicationStatus: "APPLIED",
    applicationDate: new Date("2024-01-01"),
    salaryMin: null,
    salaryMax: null,
    jobPostingUrl: null,
    jobDescription: null,
    rejectionCategory: null,
    rejectionReason: null,
    notes: null,
    sourceName: "LinkedIn",
    rounds: [],
    ...overrides,
  };
}

class FakeJobApplicationsRepository implements JobApplicationsRepository {
  applications = new Map<string, ApplicationDetail>();

  async findManyForList() {
    return { items: [], nextCursor: null };
  }

  async findDetailById(id: string) {
    return this.applications.get(id) ?? null;
  }

  async existsForUser(id: string) {
    return this.applications.has(id);
  }

  async create(data: CreateApplicationData) {
    const detail = toDetail({
      company: data.company,
      position: data.position,
      applicationStatus: data.applicationStatus ?? "APPLIED",
      rejectionCategory: data.rejectionCategory ?? null,
      rejectionReason: data.rejectionReason ?? null,
    });
    this.applications.set(detail.id, detail);
    return detail;
  }

  async update(
    id: string,
    _userId: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationDetail | null> {
    const existing = this.applications.get(id);
    if (!existing) {
      return null;
    }
    const updated: ApplicationDetail = {
      ...existing,
      ...(data.company !== undefined ? { company: data.company } : {}),
      ...(data.applicationStatus !== undefined
        ? { applicationStatus: data.applicationStatus }
        : {}),
      ...(data.rejectionCategory !== undefined
        ? { rejectionCategory: data.rejectionCategory }
        : {}),
      ...(data.rejectionReason !== undefined
        ? { rejectionReason: data.rejectionReason }
        : {}),
    };
    this.applications.set(id, updated);
    return updated;
  }

  async delete(id: string) {
    return this.applications.delete(id);
  }
}

describe("CreateApplicationUseCase", () => {
  it("captures structured rejection data on a rejected application", async () => {
    const repository = new FakeJobApplicationsRepository();
    const useCase = new CreateApplicationUseCase(repository);

    const result = await useCase.execute({
      userId: USER_ID,
      company: "Acme",
      position: "Engineer",
      applicationSourceId: "source-1",
      applicationDate: new Date("2026-08-01"),
      applicationStatus: "REJECTED",
      rejectionCategory: "SYSTEM_DESIGN",
      rejectionReason: "Missing trade-offs",
    });

    expect(result).toMatchObject({
      applicationStatus: "REJECTED",
      rejectionCategory: "SYSTEM_DESIGN",
      rejectionReason: "Missing trade-offs",
    });
  });
});

describe("UpdateApplicationUseCase", () => {
  it("throws NotFoundError when the application does not exist for the user", async () => {
    const repository = new FakeJobApplicationsRepository();
    const useCase = new UpdateApplicationUseCase(repository);

    await expect(
      useCase.execute({ id: "missing", userId: USER_ID, company: "New Co" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("updates an existing application", async () => {
    const repository = new FakeJobApplicationsRepository();
    repository.applications.set(APPLICATION_ID, toDetail());
    const useCase = new UpdateApplicationUseCase(repository);

    const result = await useCase.execute({
      id: APPLICATION_ID,
      userId: USER_ID,
      company: "New Co",
    });

    expect(result.company).toBe("New Co");
  });

  it("clears rejection data when an application leaves rejected status", async () => {
    const repository = new FakeJobApplicationsRepository();
    repository.applications.set(
      APPLICATION_ID,
      toDetail({
        applicationStatus: "REJECTED",
        rejectionCategory: "SYSTEM_DESIGN",
        rejectionReason: "Missing trade-offs",
      }),
    );
    const useCase = new UpdateApplicationUseCase(repository);

    const result = await useCase.execute({
      id: APPLICATION_ID,
      userId: USER_ID,
      applicationStatus: "INTERVIEWING",
    });

    expect(result).toMatchObject({
      applicationStatus: "INTERVIEWING",
      rejectionCategory: null,
      rejectionReason: null,
    });
  });
});

describe("DeleteApplicationUseCase", () => {
  it("throws NotFoundError when the application does not exist for the user", async () => {
    const repository = new FakeJobApplicationsRepository();
    const useCase = new DeleteApplicationUseCase(repository);

    await expect(
      useCase.execute({ id: "missing", userId: USER_ID }),
    ).rejects.toThrow(NotFoundError);
  });

  it("deletes an existing application", async () => {
    const repository = new FakeJobApplicationsRepository();
    repository.applications.set(APPLICATION_ID, toDetail());
    const useCase = new DeleteApplicationUseCase(repository);

    await expect(
      useCase.execute({ id: APPLICATION_ID, userId: USER_ID }),
    ).resolves.toBeUndefined();
    expect(repository.applications.has(APPLICATION_ID)).toBe(false);
  });
});
