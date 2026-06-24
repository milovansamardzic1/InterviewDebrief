import type {
  AuthSessionResponse,
  LoginRequest,
  RegisterRequest,
} from "@interwjuer/contracts";

import { AUTH_COOKIE_MAX_AGE_SECONDS } from "@/lib/auth/constants";

function getApiUrl() {
  const apiUrl = process.env.API_URL;

  if (apiUrl) {
    return apiUrl.replace(/\/$/, "");
  }

  return "http://localhost:4000";
}

function parseAccessTokenFromResponse(response: Response): string | null {
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [response.headers.get("set-cookie")].filter(
          (value): value is string => value !== null,
        );

  for (const cookie of setCookies) {
    const match = cookie.match(/access_token=([^;]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}

type AuthApiSuccess = {
  user: AuthSessionResponse["user"];
  accessToken: string;
  expiresIn: number;
};

export async function loginWithApi(
  body: LoginRequest,
): Promise<
  | { ok: true; data: AuthApiSuccess }
  | { ok: false; status: number; error: string }
> {
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json()) as AuthSessionResponse | { error?: string };

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error:
        typeof data === "object" && data && "error" in data && data.error
          ? data.error
          : "Login failed",
    };
  }

  const accessToken = parseAccessTokenFromResponse(response);

  if (!accessToken) {
    return {
      ok: false,
      status: 500,
      error: "Authentication token missing from API response",
    };
  }

  return {
    ok: true,
    data: {
      user: (data as AuthSessionResponse).user,
      accessToken,
      expiresIn: AUTH_COOKIE_MAX_AGE_SECONDS,
    },
  };
}

export async function registerWithApi(
  body: RegisterRequest,
): Promise<
  | { ok: true; data: AuthApiSuccess }
  | { ok: false; status: number; error: string }
> {
  const response = await fetch(`${getApiUrl()}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json()) as AuthSessionResponse | { error?: string };

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error:
        typeof data === "object" && data && "error" in data && data.error
          ? data.error
          : "Registration failed",
    };
  }

  const accessToken = parseAccessTokenFromResponse(response);

  if (!accessToken) {
    return {
      ok: false,
      status: 500,
      error: "Authentication token missing from API response",
    };
  }

  return {
    ok: true,
    data: {
      user: (data as AuthSessionResponse).user,
      accessToken,
      expiresIn: AUTH_COOKIE_MAX_AGE_SECONDS,
    },
  };
}
