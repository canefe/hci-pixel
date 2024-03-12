import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./db/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgres://postgres.bevngzdbybykcvnllodu:theBigGame@@11@aws-0-eu-west-2.pooler.supabase.com:5432/postgres",
  },
  schemaFilter: ["game"],
} satisfies Config;
