import { betterAuth } from "better-auth";
import { schema } from "@/db/schema";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
 
export const auth = betterAuth({
    emailAndPassword: {
      enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    plugins: [nextCookies()]
});