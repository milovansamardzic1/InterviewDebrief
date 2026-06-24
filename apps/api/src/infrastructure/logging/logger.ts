export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  child(bindings: LogContext): Logger;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function resolveMinLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL?.toLowerCase();

  if (configured && configured in LEVEL_PRIORITY) {
    return configured as LogLevel;
  }

  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

/**
 * Serializes Error instances (including `cause`) into a plain object so they
 * survive `JSON.stringify`, which otherwise drops non-enumerable fields.
 */
function serializeError(error: unknown): unknown {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.cause !== undefined
        ? { cause: serializeError(error.cause) }
        : {}),
    };
  }

  return error;
}

function normalizeContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return undefined;
  }

  const normalized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    normalized[key] = value instanceof Error ? serializeError(value) : value;
  }

  return normalized;
}

class ConsoleLogger implements Logger {
  private readonly minPriority: number;

  constructor(
    private readonly bindings: LogContext = {},
    minLevel: LogLevel = resolveMinLevel(),
  ) {
    this.minPriority = LEVEL_PRIORITY[minLevel];
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    if (LEVEL_PRIORITY[level] < this.minPriority) {
      return;
    }

    const entry = {
      level,
      time: new Date().toISOString(),
      message,
      ...this.bindings,
      ...normalizeContext(context),
    };

    const line = JSON.stringify(entry);

    if (level === "error") {
      console.error(line);
    } else if (level === "warn") {
      console.warn(line);
    } else {
      console.log(line);
    }
  }

  debug(message: string, context?: LogContext): void {
    this.write("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write("error", message, context);
  }

  child(bindings: LogContext): Logger {
    return new ConsoleLogger({ ...this.bindings, ...bindings }, resolveMinLevel());
  }
}

export function createLogger(bindings: LogContext = {}): Logger {
  return new ConsoleLogger(bindings);
}

export const logger = createLogger();
