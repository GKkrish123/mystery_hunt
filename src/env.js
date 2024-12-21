import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    FB_KING: z.string(),
    REDIS_URL: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_FB_APIKEY: z.string(),
    NEXT_PUBLIC_FB_AUTHDOMAIN: z.string(),
    NEXT_PUBLIC_FB_PROJECTID: z.string(),
    NEXT_PUBLIC_FB_STORAGEBUCKET: z.string(),
    NEXT_PUBLIC_FB_MESSAGESENDERID: z.string(),
    NEXT_PUBLIC_FB_APPID: z.string(),
    NEXT_PUBLIC_FB_MEASUREID: z.string(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_FB_APIKEY: process.env.NEXT_PUBLIC_FB_APIKEY,
    NEXT_PUBLIC_FB_AUTHDOMAIN: process.env.NEXT_PUBLIC_FB_AUTHDOMAIN,
    NEXT_PUBLIC_FB_PROJECTID: process.env.NEXT_PUBLIC_FB_PROJECTID,
    NEXT_PUBLIC_FB_STORAGEBUCKET: process.env.NEXT_PUBLIC_FB_STORAGEBUCKET,
    NEXT_PUBLIC_FB_MESSAGESENDERID: process.env.NEXT_PUBLIC_FB_MESSAGESENDERID,
    NEXT_PUBLIC_FB_APPID: process.env.NEXT_PUBLIC_FB_APPID,
    NEXT_PUBLIC_FB_MEASUREID: process.env.NEXT_PUBLIC_FB_MEASUREID,
    FB_KING: process.env.FB_KING,
    REDIS_URL: process.env.REDIS_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
