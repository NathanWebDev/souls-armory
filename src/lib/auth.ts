import { betterAuth } from "better-auth";
import { schema } from "@/db/schema";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { checkProfileUpdate } from "@/lib/profile-hook";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { after } from "next/server";
import { Resend } from "resend";

import EmailTemplate from "../app/components/emails/email-template";

const resend = new Resend(process.env.RESEND_API_KEY as string);


async function sendEmail(to: string, subject: string, props: React.ComponentProps<typeof EmailTemplate>) {
  const { error } = await resend.emails.send({
    from: `Souls Armory <${process.env.SENDER_EMAIL_ID}>`,
    to,
    subject,
    react: EmailTemplate(props)
  })
  if (error) console.error(`Failed to send "${subject}" email:`, error)
}

function sendEmailInBackground(...args: Parameters<typeof sendEmail>) {
  after(() => sendEmail(...args))
}

const emailRateLimit = {
  window: Number(process.env.EMAIL_RATE_LIMIT_WINDOW) || 30,
  max: Number(process.env.EMAIL_RATE_LIMIT_MAX) || 1
}

export const auth = betterAuth({
    rateLimit: {
      storage: "database",
      customRules: {
        "/forget-password": emailRateLimit,
        "/request-password-reset": emailRateLimit,
        "/send-verification-email": emailRateLimit,
        "/delete-user": emailRateLimit
      }
    },
    emailAndPassword: {
      sendResetPassword: async ({ user, url }) => {
        sendEmailInBackground(user.email, "Reset your password for Souls Armory", {
          heading: "Reset Your Password",
          username: user.name,
          message: "We received a request to reset your password for your Souls Armory account. Click the button below to set a new password:",
          button: { label: "Reset Password", link: url },
          footnote: "If you did not request a password reset, you can safely ignore this email."
        })
      },
      enabled: true,
      requireEmailVerification: true
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        sendEmailInBackground(user.email, "Verify your email for Souls Armory", {
          heading: "Verify Your Account",
          username: user.name,
          message: "Thank you for signing up on Souls Armory! Please verify your account by clicking the button below:",
          button: { label: "Verify Account", link: url },
          footnote: "If you did not create this account, you can safely ignore this email."
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
    user: {
      additionalFields: {
        description: {
          type: "string",
          required: false,
          input: true
        }
      },
      deleteUser: {
        enabled: true,
        afterDelete: async (user) => {
          await sendEmail(user.email, "Your Souls Armory account has been deleted", {
            heading: "Your Account Has Been Deleted",
            username: user.name,
            message: "Your Souls Armory account has been permanently deleted. We're sorry to see you go.",
            footnote: "If you did not make this request, please contact us right away."
          })
        },
        sendDeleteAccountVerification: async ({ user, url }) => {
          await sendEmail(user.email, "Confirm account deletion for Souls Armory", {
            heading: "Confirm Account Deletion",
            username: user.name,
            message: "We received a request to permanently delete your Souls Armory account. Click the button below to confirm:",
            button: { label: "Delete my account", link: url, color: "#b91c1c" },
            footnote: "If you did not request this, you can safely ignore this email and your account will not be deleted."
          })
        }
      }
    },
    databaseHooks: {
      user: {
        update: {
          before: checkProfileUpdate
        }
      }
    },
    plugins: [admin(), nextCookies()]
});