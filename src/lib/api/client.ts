import { getAuthHeaders } from "@/lib/auth/session";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function parseJsonWithDates(text: string): unknown {
  return JSON.parse(text, (_key, value) => {
    if (typeof value === "string" && ISO_DATE_PATTERN.test(value)) {
      return new Date(value);
    }

    return value;
  });
}

function getApiUrl() {
  const apiUrl = process.env.API_URL;

  if (apiUrl) {
    return apiUrl.replace(/\/$/, "");
  }

  return "http://localhost:4000";
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...authHeaders,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // ignore non-JSON error bodies
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return parseJsonWithDates(text) as T;
}

function withJsonBody(body: unknown): RequestInit {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const api = {
  get<T>(path: string) {
    return request<T>(path);
  },

  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: "POST", ...withJsonBody(body) });
  },

  patch<T>(path: string, body: unknown) {
    return request<T>(path, { method: "PATCH", ...withJsonBody(body) });
  },

  delete(path: string) {
    return request<void>(path, { method: "DELETE" });
  },
};

export function isNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}
