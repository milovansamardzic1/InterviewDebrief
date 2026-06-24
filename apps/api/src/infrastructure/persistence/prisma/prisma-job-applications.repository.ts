import type { PrismaClient } from "@prisma/client";

import type {
  CreateApplicationData,
  FindApplicationByIdOptions,
  FindManyApplicationsOptions,
  JobApplicationsRepository,
  UpdateApplicationData,
} from "../../../application/job-applications/ports/job-applications.repository.js";
import type { ApplicationDetailRecord } from "../../../application/job-applications/read-models/application-detail.record.js";
import type { Logger } from "../../logging/logger.js";
import {
  detailArgs,
  listArgs,
  toApplicationDetailRecord,
  toApplicationListRecord,
} from "./mappers/job-application.mapper.js";
import { runPrismaOperation } from "./prisma-error.js";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

export class PrismaJobApplicationsRepository implements JobApplicationsRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async findManyForList(options: FindManyApplicationsOptions) {
    const take = Math.min(options.limit ?? DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT) + 1;

    const applications = await runPrismaOperation(
      "jobApplication.findManyForList",
      this.logger,
      () =>
        this.db.jobApplication.findMany({
          where: { userId: options.userId },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
          take,
          ...(options.cursor
            ? { cursor: { id: options.cursor }, skip: 1 }
            : {}),
          ...listArgs,
        }),
    );

    const hasMore = applications.length > take - 1;
    const page = hasMore ? applications.slice(0, take - 1) : applications;

    return {
      items: page.map(toApplicationListRecord),
      nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
    };
  }

  async findDetailById(
    id: string,
    options: FindApplicationByIdOptions,
  ): Promise<ApplicationDetailRecord | null> {
    const application = await runPrismaOperation(
      "jobApplication.findDetailById",
      this.logger,
      () =>
        this.db.jobApplication.findFirst({
          where: {
            id,
            userId: options.userId,
          },
          ...detailArgs,
        }),
    );

    if (!application) {
      return null;
    }

    return toApplicationDetailRecord(application);
  }

  async existsForUser(id: string, userId: string): Promise<boolean> {
    const count = await runPrismaOperation(
      "jobApplication.existsForUser",
      this.logger,
      () =>
        this.db.jobApplication.count({
          where: { id, userId },
        }),
    );

    return count > 0;
  }

  async create(data: CreateApplicationData): Promise<ApplicationDetailRecord> {
    const application = await runPrismaOperation(
      "jobApplication.create",
      this.logger,
      () =>
        this.db.jobApplication.create({
          data: {
            userId: data.userId,
            company: data.company,
            position: data.position,
            applicationSourceId: data.applicationSourceId,
            applicationDate: data.applicationDate,
            location: data.location ?? null,
            salaryMin: data.salaryMin ?? null,
            salaryMax: data.salaryMax ?? null,
            jobPostingUrl: data.jobPostingUrl ?? null,
            jobDescription: data.jobDescription ?? null,
            applicationStatus: data.applicationStatus ?? "APPLIED",
            notes: data.notes ?? null,
          },
          ...detailArgs,
        }),
    );

    return toApplicationDetailRecord(application);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationDetailRecord | null> {
    const existing = await this.findDetailById(id, { userId });

    if (!existing) {
      return null;
    }

    const application = await runPrismaOperation(
      "jobApplication.update",
      this.logger,
      () =>
        this.db.jobApplication.update({
          where: { id },
          data: {
            ...(data.company !== undefined ? { company: data.company } : {}),
            ...(data.position !== undefined ? { position: data.position } : {}),
            ...(data.applicationSourceId !== undefined
              ? { applicationSourceId: data.applicationSourceId }
              : {}),
            ...(data.applicationDate !== undefined
              ? { applicationDate: data.applicationDate }
              : {}),
            ...(data.location !== undefined ? { location: data.location } : {}),
            ...(data.salaryMin !== undefined ? { salaryMin: data.salaryMin } : {}),
            ...(data.salaryMax !== undefined ? { salaryMax: data.salaryMax } : {}),
            ...(data.jobPostingUrl !== undefined
              ? { jobPostingUrl: data.jobPostingUrl }
              : {}),
            ...(data.jobDescription !== undefined
              ? { jobDescription: data.jobDescription }
              : {}),
            ...(data.applicationStatus !== undefined
              ? { applicationStatus: data.applicationStatus }
              : {}),
            ...(data.rejectionReason !== undefined
              ? { rejectionReason: data.rejectionReason }
              : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
          },
          ...detailArgs,
        }),
    );

    return toApplicationDetailRecord(application);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await this.existsForUser(id, userId);

    if (!existing) {
      return false;
    }

    await runPrismaOperation("jobApplication.delete", this.logger, () =>
      this.db.jobApplication.delete({ where: { id } }),
    );

    return true;
  }
}
