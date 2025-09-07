"use server";

import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
    await auth.api.signInEmail({
        body: {
            email: email,
            password: password
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