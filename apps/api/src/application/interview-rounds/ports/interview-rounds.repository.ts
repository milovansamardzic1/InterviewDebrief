import type { InterviewRoundStatus } from "@interwjuer/contracts";

import type { InterviewRoundResponse } from "@interwjuer/contracts";

export type CreateInterviewRoundData = {
  applicationId: string;
  userId: string;
  interviewTypeId: string;
  sortOrder?: number;
  status?: InterviewRoundStatus;
  scheduledAt?: Date | null;
  notes?: string | null;
};

export type UpdateInterviewRoundData = {
  interviewTypeId?: string;
  sortOrder?: number;
  status?: InterviewRoundStatus;
  scheduledAt?: Date | null;
  completedAt?: Date | null;
  notes?: string | null;
};

export interface InterviewRoundsRepository {
  create(data: CreateInterviewRoundData): Promise<InterviewRoundResponse | null>;

  update(
    applicationId: string,
    roundId: string,
    userId: string,
    data: UpdateInterviewRoundData,
  ): Promise<InterviewRoundResponse | null>;

  delete(
    applicationId: string,
    roundId: string,
    userId: string,
  ): Promise<boolean>;

  findRoundForUser(
    applicationId: string,
    roundId: string,
    userId: string,
  ): Promise<InterviewRoundResponse | null>;
}
