import { betterAuth } from "better-auth";
import { schema } from "@/db/schema";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
 
export const auth = betterAuth({
    emailAndPassword: {
      enabled: true
    },
    socialProviders: {
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID as string, 
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string, 
      }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    plugins: [nextCookies()]
});