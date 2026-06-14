import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Типобезопасные переменные окружения (спека §1).
 * USE_MOCKS переключает источник данных мок ↔ реальный REST (используется в фазе 1).
 */
export const env = createEnv({
  server: {
    USE_MOCKS: z
      .enum(["true", "false"])
      .default("true")
      .transform((v) => v === "true"),
    ADVANTSHOP_API_BASE: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_YM_ID: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_YM_ID: process.env.NEXT_PUBLIC_YM_ID,
  },
});
