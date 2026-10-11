import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1).default("Brritto Admin"),
  VITE_API_BASE_URL: z.string().min(1).default("/api"),
  VITE_JWT_SECRET_KEY: z.string().min(1),
  VITE_ENABLE_MOCKS: z.stringbool().default(false),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const ENV = {
  APP_NAME: parsed.data.VITE_APP_NAME,
  API_BASE_URL: parsed.data.VITE_API_BASE_URL,
  JWT_SECRET_KEY: parsed.data.VITE_JWT_SECRET_KEY,
  ENABLE_MOCKS: parsed.data.VITE_ENABLE_MOCKS,
} as const;

export type Env = typeof ENV;
