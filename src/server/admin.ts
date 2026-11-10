"use server";

import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { review, reviewReport, user } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { recomputeRating } from "@/lib/recompute-rating";

const fail = (message: string) => ({ success: false as const, message })

const load = async (reviewId: string) => {
    const admin = await requireAdmin()

    if (!admin) {
        return { error: fail("Admins only."), admin: null, target: null }
    }

    const [target] = await db
        .select({ id: review.id, title: review.title, itemId: review.itemId, authorId: user.id, authorName: user.name })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .where(eq(review.id, reviewId))

    return target
        ? { error: null, admin, target }
        : { error: fail("That review no longer exists."), admin: null, target: null }
}

export const banReportedUser = async (reviewId: string) => {
    const loaded = await load(reviewId)

    if (loaded.error) return loaded.error

    const { admin, target } = loaded

    if (target.authorId === admin.user.id) {
        return fail("You can't ban yourself.")
    }

    try {
        await auth.api.banUser({
            body: { userId: target.authorId, banReason: `Reported review: ${target.title}` },
            headers: await headers(),
        })
        await db.delete(reviewReport).where(
            inArray(reviewReport.reviewId, db.select({ id: review.id }).from(review).where(eq(review.userId, target.authorId))),
        )

        return { success: true as const, message: `Banned user "${target.authorName}".` }
    } catch (error) {
        console.error("Could not ban user.", error)

        return fail("Could not ban the user.")
    }
}

export const deleteReportedReview = async (reviewId: string) => {
    const loaded = await load(reviewId)

    if (loaded.error) return loaded.error

    const { target } = loaded

    try {
        await db.delete(review).where(eq(review.id, reviewId))        await recomputeRating(target.itemId)

        return { success: true as const, message: `Deleted the review "${target.title}" by ${target.authorName}.` }
    } catch (error) {
        console.error("Could not delete review.", error)

        return fail("Could not delete the review.")
    }
}

export const ignoreReports = async (reviewId: string) => {
    const loaded = await load(reviewId)

    if (loaded.error) return loaded.error

    const { target } = loaded

    try {
        await db.delete(reviewReport).where(eq(reviewReport.reviewId, reviewId))

        return { success: true as const, message: `Ignored the reports on "${target.title}" by ${target.authorName}.` }
    } catch (error) {
        console.error("Could not ignore reports.", error)

        return fail("Could not ignore the reports.")
    }
}
