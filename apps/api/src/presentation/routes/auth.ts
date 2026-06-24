import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import { NotFoundError } from "../../application/shared/errors/app-error.js";
import type { GetCurrentUserUseCase } from "../../application/auth/use-cases/get-current-user.use-case.js";
import type { LoginUseCase } from "../../application/auth/use-cases/login.use-case.js";
import type { RegisterUseCase } from "../../application/auth/use-cases/register.use-case.js";
import type { AuthTokenService } from "../../application/auth/ports/auth-token.service.js";
import type { AppVariables } from "../context.js";
import { createRateLimiter } from "../middleware/rate-limiter.js";
import { LoginBodySchema, RegisterBodySchema } from "../schemas/auth.schema.js";

export type PublicAuthRouteDeps = {
  login: LoginUseCase;
  register: RegisterUseCase;
  tokens: AuthTokenService;
};

export type ProtectedAuthRouteDeps = {
  getCurrentUser: GetCurrentUserUseCase;
};

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  keyPrefix: "auth",
});

function setAccessTokenCookie(
  c: Parameters<typeof setCookie>[0],
  accessToken: string,
  expiresInSeconds: number,
) {
  setCookie(c, "access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: expiresInSeconds,
  });
}

function clearAccessTokenCookie(c: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(c, "access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });
}

export function createPublicAuthRoutes(deps: PublicAuthRouteDeps) {
  return new Hono()
    .use("*", authRateLimiter)
    .post("/login", zValidator("json", LoginBodySchema), async (c) => {
      const body = c.req.valid("json");
      const result = await deps.login.execute(body);

      if (!result) {
        return c.json({ error: "Invalid email or password" }, 401);
      }

      setAccessTokenCookie(c, result.accessToken, result.expiresIn);
      return c.json({ user: result.user });
    })
    .post("/register", zValidator("json", RegisterBodySchema), async (c) => {
      const body = c.req.valid("json");
      const result = await deps.register.execute(body);

      setAccessTokenCookie(c, result.accessToken, result.expiresIn);
      return c.json({ user: result.user }, 201);
    })
    .post("/logout", async (c) => {
      clearAccessTokenCookie(c);
      return c.json({ ok: true });
    });
}

export function createProtectedAuthRoutes(deps: ProtectedAuthRouteDeps) {
  return new Hono<{ Variables: AppVariables }>().get("/me", async (c) => {
    const userId = c.get("userId");
    const user = await deps.getCurrentUser.execute(userId);

    if (!user) {
      throw new NotFoundError("User not found", { code: "USER_NOT_FOUND" });
    }

    return c.json({ user });
  });
}
