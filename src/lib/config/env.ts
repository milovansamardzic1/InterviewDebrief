import { z } from "zod";

const EnvSchema = z.object({
  API_URL: z.string().url().default("http://localhost:4000"),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(604800),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export function loadEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}
