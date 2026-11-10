import { redirect } from "next/navigation"

import { requireAdmin } from "@/lib/admin"
import { getReportedReviews } from "@/lib/review-routes"
import { ReportedUsersCard } from "@/shad-components/reported-users-card"

export default async function AdminPage() {
    if (!(await requireAdmin())) {
        redirect("/home")
    }

    const reports = await getReportedReviews()

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-xl">
                <ReportedUsersCard reports={reports} />
            </div>
        </div>
    )
}
