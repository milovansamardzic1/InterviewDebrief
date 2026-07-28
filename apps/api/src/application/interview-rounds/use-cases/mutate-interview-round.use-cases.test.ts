import type { InterviewRoundResponse } from "@interwjuer/contracts";
import { beforeEach, describe, expect, it } from "vitest";

import {
  NotFoundError,
  ValidationError,
} from "../../shared/errors/app-error.js";
import type {
  CreateInterviewRoundData,
  InterviewRoundsRepository,
  UpdateInterviewRoundData,
} from "../ports/interview-rounds.repository.js";
import {
  CreateInterviewRoundUseCase,
  DeleteInterviewRoundUseCase,
  UpdateInterviewRoundUseCase,
} from "./mutate-interview-round.use-cases.js";

const APPLICATION_ID = "application-1";
const ROUND_ID = "round-1";
const USER_ID = "user-1";

function toResponse(
  id: string,
  overrides: Partial<InterviewRoundResponse> = {},
): InterviewRoundResponse {
  return {
    id,
    sortOrder: 0,
    status: "SCHEDULED",
    scheduledAt: null,
    completedAt: null,
    notes: null,
    interviewTypeName: "Technical",
    interviewTypeDescription: null,
    questions: [],
    skillEvaluations: [],
    ...overrides,
  };
}

class FakeInterviewRoundsRepository implements InterviewRoundsRepository {
  rounds = new Map<string, InterviewRoundResponse>();
  applicationExists = true;

  async create(
    data: CreateInterviewRoundData,
  ): Promise<InterviewRoundResponse | null> {
    if (!this.applicationExists) {
      return null;
    }
    const round = toResponse(ROUND_ID, {
      status: data.status ?? "SCHEDULED",
      scheduledAt: data.scheduledAt ?? null,
      notes: data.notes ?? null,
    });
    this.rounds.set(round.id, round);
    return round;
  }

  async update(
    _applicationId: string,
    roundId: string,
    _userId: string,
    data: UpdateInterviewRoundData,
  ): Promise<InterviewRoundResponse | null> {
    const existing = this.rounds.get(roundId);
    if (!existing) {
      return null;
    }
    const updated: InterviewRoundResponse = {
      ...existing,
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),
      ...(data.completedAt !== undefined
        ? { completedAt: data.completedAt }
        : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
    };
    this.rounds.set(roundId, updated);
    return updated;
  }

  async delete(
    _applicationId: string,
    roundId: string,
    _userId: string,
  ): Promise<boolean> {
    return this.rounds.delete(roundId);
  }

  async findRoundForUser(
    _applicationId: string,
    roundId: string,
    _userId: string,
  ): Promise<InterviewRoundResponse | null> {
    return this.rounds.get(roundId) ?? null;
  }
}

describe("CreateInterviewRoundUseCase", () => {
  it("throws NotFoundError when the application does not exist for the user", async () => {
    const repository = new FakeInterviewRoundsRepository();
    repository.applicationExists = false;
    const useCase = new CreateInterviewRoundUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        userId: USER_ID,
        interviewTypeId: "type-1",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("creates a round when the application exists", async () => {
    const repository = new FakeInterviewRoundsRepository();
    const useCase = new CreateInterviewRoundUseCase(repository);

    const result = await useCase.execute({
      applicationId: APPLICATION_ID,
      userId: USER_ID,
      interviewTypeId: "type-1",
    });

    expect(result.id).toBe(ROUND_ID);
  });
});

describe("UpdateInterviewRoundUseCase", () => {
  let repository: FakeInterviewRoundsRepository;
  let useCase: UpdateInterviewRoundUseCase;

  beforeEach(() => {
    repository = new FakeInterviewRoundsRepository();
    repository.rounds.set(
      ROUND_ID,
      toResponse(ROUND_ID, { status: "SCHEDULED" }),
    );
    useCase = new UpdateInterviewRoundUseCase(repository);
  });

  it("throws NotFoundError when the round does not exist for the user", async () => {
    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: "missing-round",
        userId: USER_ID,
        status: "IN_PROGRESS",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("throws ValidationError when the status transition is invalid", async () => {
    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        userId: USER_ID,
        status: "COMPLETED",
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("applies a valid status transition and auto-sets completedAt", async () => {
    await repository.update(APPLICATION_ID, ROUND_ID, USER_ID, {
      status: "IN_PROGRESS",
    });

    const result = await useCase.execute({
      applicationId: APPLICATION_ID,
      roundId: ROUND_ID,
      userId: USER_ID,
      status: "COMPLETED",
    });

    expect(result.status).toBe("COMPLETED");
    expect(result.completedAt).toBeInstanceOf(Date);
  });
});

describe("DeleteInterviewRoundUseCase", () => {
  it("throws NotFoundError when the round does not exist", async () => {
    const repository = new FakeInterviewRoundsRepository();
    const useCase = new DeleteInterviewRoundUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: "missing-round",
        userId: USER_ID,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("deletes an existing round", async () => {
    const repository = new FakeInterviewRoundsRepository();
    repository.rounds.set(ROUND_ID, toResponse(ROUND_ID));
    const useCase = new DeleteInterviewRoundUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        userId: USER_ID,
      }),
    ).resolves.toBeUndefined();
    expect(repository.rounds.has(ROUND_ID)).toBe(false);
  });
});
