export type ErrorCategory =
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL";

export type AppErrorOptions = {
  code?: string;
  details?: unknown;
  cause?: unknown;
};

/**
 * Base class for all expected ("operational") application errors.
 * The transport layer is responsible for translating `category` into a
 * protocol-specific status (e.g. HTTP code), so this stays framework-agnostic.
 */
export abstract class AppError extends Error {
  abstract readonly category: ErrorCategory;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = this.constructor.name;
    this.code = options.code ?? this.constructor.name;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  readonly category = "VALIDATION" as const;
}

export class UnauthenticatedError extends AppError {
  readonly category = "UNAUTHENTICATED" as const;

  constructor(message = "Unauthorized", options: AppErrorOptions = {}) {
    super(message, options);
  }
}

export class ForbiddenError extends AppError {
  readonly category = "FORBIDDEN" as const;

  constructor(message = "Forbidden", options: AppErrorOptions = {}) {
    super(message, options);
  }
}

export class NotFoundError extends AppError {
  readonly category = "NOT_FOUND" as const;
}

export class ConflictError extends AppError {
  readonly category = "CONFLICT" as const;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
