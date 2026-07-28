export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}
