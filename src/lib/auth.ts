import { betterAuth } from "better-auth";
import { schema } from "@/db/schema";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

import EmailVerification from "../app/components/emails/email-verification";
import ForgotPassword from "../app/components/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);
 
export const auth = betterAuth({
    emailAndPassword: {
      sendResetPassword: async ({ user, url }) => {
        resend.emails.send({
          from: `Souls Armory <${process.env.SENDER_EMAIL_ID}>`,
          to: user.email,
          subject: "Reset your password for Souls Armory",
          react: ForgotPassword({ username: user.name, resetLink: url })
        })
      },
      enabled: true,
      requireEmailVerification: true
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        resend.emails.send({
          from: `Souls Armory <${process.env.SENDER_EMAIL_ID}>`,
          to: user.email,
          subject: "Verify your email for Souls Armory",
          react: EmailVerification({ username: user.name, verificationLink: url })
        })
      },
      autoSignInAfterVerification: true,
      sendOnSignUp: true
    },
    socialProviders: {
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID as string, 
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string, 
      },
      google: {
        prompt: "select_account", 
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    plugins: [nextCookies()]
});