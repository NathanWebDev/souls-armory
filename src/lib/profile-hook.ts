import { APIError } from "better-auth/api"

import { validateProfileUpdate } from "@/lib/avatar"


export async function checkProfileUpdate<T extends Record<string, unknown>>(
    user: T,
    context?: { path?: string }
) {
    if (context?.path === "/update-user") {
        const message = validateProfileUpdate(user)

        if (message) {
            throw new APIError("BAD_REQUEST", { message })
        }
    }

    return { data: user }
}
