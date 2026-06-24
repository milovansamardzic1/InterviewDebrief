import { NotFoundError } from "./errors/app-error.js";

export function assertResourceExists<T>(
  resource: T | null | undefined,
  message = "Resource not found",
  code = "NOT_FOUND",
): asserts resource is T {
  if (resource == null) {
    throw new NotFoundError(message, { code });
  }
}

export function assertCondition(
  condition: boolean,
  message = "Resource not found",
  code = "NOT_FOUND",
): void {
  if (!condition) {
    throw new NotFoundError(message, { code });
  }
}
