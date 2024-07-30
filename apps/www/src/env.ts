/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
    STAGING_TEST_EMAILS: z.string().optional(),
    NEXT_PUBLIC_SUPERADMIN_EMAIL: z.string().email(),
  },
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    DISCORD_WEBHOOK_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: undefined,
    ENV: process.env.ENV,
    STAGING_TEST_EMAILS: process.env.STAGING_TEST_EMAILS,
    NEXT_PUBLIC_SUPERADMIN_EMAIL: process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
