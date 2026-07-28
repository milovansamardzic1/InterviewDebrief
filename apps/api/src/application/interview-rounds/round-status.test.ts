import { describe, expect, it } from "vitest";

import { ValidationError } from "../shared/errors/app-error.js";
import {
  assertValidStatusTransition,
  resolveCompletedAt,
} from "./round-status.js";

describe("assertValidStatusTransition", () => {
  it("allows a same-status no-op transition", () => {
    expect(() =>
      assertValidStatusTransition("SCHEDULED", "SCHEDULED"),
    ).not.toThrow();
  });

  it("allows a valid transition", () => {
    expect(() =>
      assertValidStatusTransition("SCHEDULED", "IN_PROGRESS"),
    ).not.toThrow();
    expect(() =>
      assertValidStatusTransition("IN_PROGRESS", "COMPLETED"),
    ).not.toThrow();
  });

  it("throws a ValidationError on an invalid transition", () => {
    expect(() => assertValidStatusTransition("COMPLETED", "SCHEDULED")).toThrow(
      ValidationError,
    );
    expect(() => assertValidStatusTransition("SCHEDULED", "COMPLETED")).toThrow(
      ValidationError,
    );
  });

  it("throws with the INVALID_STATUS_TRANSITION code", () => {
    try {
      assertValidStatusTransition("SCHEDULED", "COMPLETED");
      expect.fail("expected assertValidStatusTransition to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).code).toBe("INVALID_STATUS_TRANSITION");
    }
  });
});

describe("resolveCompletedAt", () => {
  it("auto-sets completedAt on first transition into COMPLETED", () => {
    const result = resolveCompletedAt("IN_PROGRESS", "COMPLETED", undefined);
    expect(result).toBeInstanceOf(Date);
  });

  it("does not auto-set completedAt when already COMPLETED", () => {
    const result = resolveCompletedAt("COMPLETED", "COMPLETED", undefined);
    expect(result).toBeUndefined();
  });

  it("does not set completedAt for transitions that are not into COMPLETED", () => {
    const result = resolveCompletedAt("SCHEDULED", "IN_PROGRESS", undefined);
    expect(result).toBeUndefined();
  });

  it("lets an explicit completedAt always win, even null", () => {
    const explicit = new Date("2024-01-01T00:00:00Z");
    expect(resolveCompletedAt("IN_PROGRESS", "COMPLETED", explicit)).toBe(
      explicit,
    );
    expect(resolveCompletedAt("IN_PROGRESS", "COMPLETED", null)).toBeNull();
  });
});
