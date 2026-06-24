import { SignJWT, jwtVerify } from "jose";

import type {
  AccessTokenPayload,
  AuthTokenService,
} from "../../application/auth/ports/auth-token.service.js";
import type { AccessTokenVerifier } from "../../application/auth/ports/access-token.verifier.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return new TextEncoder().encode(secret);
}

function getExpiresInSeconds() {
  const configured = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? "604800");

  if (!Number.isFinite(configured) || configured <= 0) {
    return 604800;
  }

  return configured;
}

export class JoseAuthTokenService
  implements AuthTokenService, AccessTokenVerifier
{
  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const expiresInSeconds = this.getExpiresInSeconds();

    return new SignJWT({
      email: payload.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.userId)
      .setIssuedAt()
      .setExpirationTime(`${expiresInSeconds}s`)
      .sign(getJwtSecret());
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret(), {
        algorithms: ["HS256"],
      });

      const userId = payload.sub;
      const email = payload.email;

      if (typeof userId !== "string" || typeof email !== "string") {
        return null;
      }

      return { userId, email };
    } catch {
      return null;
    }
  }

  async verify(accessToken: string): Promise<{ userId: string } | null> {
    const payload = await this.verifyAccessToken(accessToken);

    if (!payload) {
      return null;
    }

    return { userId: payload.userId };
  }

  getExpiresInSeconds(): number {
    return getExpiresInSeconds();
  }
}
