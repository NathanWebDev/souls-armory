import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const requireAdmin = async () => {
    const session = await auth.api.getSession({ headers: await headers() })

    return session?.user.role === "admin" ? session : null
}
