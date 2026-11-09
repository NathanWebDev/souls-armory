"use server";

import { headers } from "next/headers";
import { and, count, desc, eq, sql, sum } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { item, review, reviewVote, user } from "@/db/schema";
import { bayesianRating } from "@/lib/rating";
import { formRules } from "@/app/components/form-rules";

const { titleMaxLength, bodyMaxLength } = formRules.reviewRules

const recomputeRating = async (itemId: string) => {
    const [row] = await db
        .select({ seed: sql<number>`coalesce(${item.seedRating}, ${item.rating})` })
        .from(item)
        .where(eq(item.id, itemId))

    const [totals] = await db
        .select({ total: sum(review.rating), reviews: count() })
        .from(review)
        .where(eq(review.itemId, itemId))

    await db
        .update(item)
        .set({
            seedRating: row.seed,
            rating: bayesianRating(row.seed, Number(totals.total ?? 0), totals.reviews),
        })
        .where(eq(item.id, itemId))
}

export const getReviews = async (itemId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    const viewerId = session?.user.id ?? ""

    return db
        .select({
            id: review.id,
            rating: review.rating,
            title: review.title,
            body: review.body,
            createdAt: review.createdAt,
            isOwner: sql<boolean>`${review.userId} = ${viewerId}`,
            authorName: user.name,
            authorImage: user.image,
            upvotes: sql<number>`(select count(*) from ${reviewVote} where ${reviewVote.reviewId} = ${review.id} and ${reviewVote.value} = 1)`.mapWith(Number),
            downvotes: sql<number>`(select count(*) from ${reviewVote} where ${reviewVote.reviewId} = ${review.id} and ${reviewVote.value} = -1)`.mapWith(Number),
            viewerVote: sql<number>`coalesce((select ${reviewVote.value} from ${reviewVote} where ${reviewVote.reviewId} = ${review.id} and ${reviewVote.userId} = ${viewerId}), 0)`.mapWith(Number),
        })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .where(eq(review.itemId, itemId))
        .orderBy(desc(review.createdAt))
}

const checkReviewContent = (input: { rating: number; title: string; body: string }) => {
    const title = input.title.trim()
    const body = input.body.trim()

    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
        return { success: false as const, message: "Please choose a rating from 1 to 5 stars." }
    }

    if (!title || title.length > titleMaxLength.maxLengthValue) {
        return { success: false as const, message: titleMaxLength.errorMessage }
    }

    if (!body || body.length > bodyMaxLength.maxLengthValue) {
        return { success: false as const, message: bodyMaxLength.errorMessage }
    }

    return { success: true as const, title, body }
}

export const addReview =async (input: { itemId: string; rating: number; title: string; body: string }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to leave a review." }
    }

    const checked = checkReviewContent(input)

    if (!checked.success) {
        return checked
    }

    const { title, body } = checked

    try {
        const existing = await db
            .select({ id: review.id })
            .from(review)
            .where(and(eq(review.itemId, input.itemId), eq(review.userId, session.user.id)))

        if (existing.length) {
            return { success: false as const, message: "You have already reviewed this weapon." }
        }

        await db.insert(review).values({
            itemId: input.itemId,
            userId: session.user.id,
            rating: input.rating,
            title,
            body,
        })

        await recomputeRating(input.itemId)

        return { success: true as const }
    } catch (error) {
        const errorMessage = error as Error

        return { success: false as const, message: errorMessage.message || "Could not save your review." }
    }
}

export const updateReview = async (input: { id: string; rating: number; title: string; body: string }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to edit a review." }
    }

    const checked = checkReviewContent(input)

    if (!checked.success) {
        return checked
    }

    try {
        const [updated] = await db
            .update(review)
            .set({ rating: input.rating, title: checked.title, body: checked.body })
            .where(and(eq(review.id, input.id), eq(review.userId, session.user.id)))
            .returning({ itemId: review.itemId })

        if (!updated) {
            return { success: false as const, message: "You can only edit your own reviews." }
        }

        await recomputeRating(updated.itemId)

        return { success: true as const }
    } catch (error) {
        const errorMessage = error as Error

        return { success: false as const, message: errorMessage.message || "Could not update your review." }
    }
}

export const deleteReview =async (reviewId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to delete a review." }
    }

    try {
        const [deleted] = await db
            .delete(review)
            .where(and(eq(review.id, reviewId), eq(review.userId, session.user.id)))
            .returning({ itemId: review.itemId })

        if (!deleted) {
            return { success: false as const, message: "You can only delete your own reviews." }
        }

        await recomputeRating(deleted.itemId)

        return { success: true as const }
    } catch (error) {
        const errorMessage = error as Error

        return { success: false as const, message: errorMessage.message || "Could not delete your review." }
    }
}

export const voteReview =async (reviewId: string, value: 1 | -1) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to vote." }
    }

    if (value !== 1 && value !== -1) {
        return { success: false as const, message: "Invalid vote." }
    }

    try {
        const [existing] = await db
            .select({ value: reviewVote.value })
            .from(reviewVote)
            .where(and(eq(reviewVote.reviewId, reviewId), eq(reviewVote.userId, session.user.id)))

        if (existing?.value === value) {
            await db
                .delete(reviewVote)
                .where(and(eq(reviewVote.reviewId, reviewId), eq(reviewVote.userId, session.user.id)))
        } else {
            await db
                .insert(reviewVote)
                .values({ reviewId, userId: session.user.id, value })
                .onConflictDoUpdate({ target: [reviewVote.reviewId, reviewVote.userId], set: { value } })
        }

        return { success: true as const }
    } catch (error) {
        const errorMessage = error as Error

        return { success: false as const, message: errorMessage.message || "Could not save your vote." }
    }
}
