import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  server: {
    DB_URL: v.pipe(
      v.string(),
      v.url()
    ),
  },
  runtimeEnv: process.env,
});