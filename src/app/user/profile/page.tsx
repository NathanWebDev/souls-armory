import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { ProfileForm } from "@/shad-components/profile-form"

export default async function Profile() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect("/user/login")
    }

    const { name, email, image, description } = session.user

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-xl">
                <ProfileForm
                    name={name}
                    email={email}
                    image={image ?? null}
                    description={description ?? ""}
                />
            </div>
        </div>
    )
}
