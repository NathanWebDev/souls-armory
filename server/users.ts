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

export const signUp = async (email: string, password: string, username: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email: email,
                password: password,
                name: username
            }
        })

        return { 
            success: true, 
            message: "Account created! Please check your email to verify your account." 
        }
    } catch (error) {
        const errorMessage = error as Error

        return { 
            success: false, 
            message: errorMessage.message || "An error occurred during sign up."
        }
    }
}