"use server";

import { auth } from "@/lib/auth";

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "example@site.com",
            password: "password123"
        }
    })
}

export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: "example@site.com",
            password: "password123",
            name: "Example User"
        }
    })
}