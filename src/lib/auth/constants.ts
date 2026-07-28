import { loadEnv } from "@/lib/config/env";

export const ACCESS_TOKEN_COOKIE = "access_token";

export const AUTH_COOKIE_MAX_AGE_SECONDS = loadEnv().JWT_EXPIRES_IN_SECONDS;
