export const ACCESS_TOKEN_COOKIE = "access_token";

export const AUTH_COOKIE_MAX_AGE_SECONDS = Number(
  process.env.JWT_EXPIRES_IN_SECONDS ?? "604800",
);
