import type { Context } from "hono";
import { getCookie } from "hono/cookie";

export function extractAccessToken(c: Context): string | undefined {
  const authorization = c.req.header("Authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  const cookieToken = getCookie(c, "access_token");

  if (cookieToken) {
    return cookieToken;
  }

  return undefined;
}
