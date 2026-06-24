import { createMiddleware } from "hono/factory";

import type { AccessTokenVerifier } from "../../application/auth/ports/access-token.verifier.js";
import { UnauthenticatedError } from "../../application/shared/errors/app-error.js";
import type { AppVariables } from "../context.js";
import { extractAccessToken } from "../lib/extract-access-token.js";

export function createAuthMiddleware(verifier: AccessTokenVerifier) {
  return createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
    const accessToken = extractAccessToken(c);

    if (!accessToken) {
      throw new UnauthenticatedError("Missing access token", {
        code: "MISSING_ACCESS_TOKEN",
      });
    }

    const verified = await verifier.verify(accessToken);

    if (!verified) {
      throw new UnauthenticatedError("Invalid access token", {
        code: "INVALID_ACCESS_TOKEN",
      });
    }

    c.set("userId", verified.userId);
    await next();
  });
}
