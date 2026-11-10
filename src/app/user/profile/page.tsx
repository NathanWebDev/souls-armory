import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getReportedReviews, getUserReviews } from "@/lib/review-routes"
import { MyReviewsCard } from "@/shad-components/my-reviews-card"
import { ProfileForm } from "@/shad-components/profile-form"
import { ReportedUsersCard } from "@/shad-components/reported-users-card"

export default async function Profile() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect("/user/login")
    }

    const { id, name, email, image, description } = session.user
    const reviews = await getUserReviews(id)
    const reports = session.user.role === "admin" ? await getReportedReviews() : null

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-xl">
                <ProfileForm
                    name={name}
                    email={email}
                    image={image ?? null}
                    description={description ?? ""}
                />
                <MyReviewsCard reviews={reviews} />
                {reports && <ReportedUsersCard reports={reports} />}
            </div>
        </div>
    )
}
