"use server";

import { headers } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { item, review, reviewReport, reviewVote } from "@/db/schema";
import { SEED_WEIGHT } from "@/lib/rating";
import { hasReviewed } from "@/lib/review-routes";
import { formRules } from "@/app/components/form-rules";

const { titleMaxLength, bodyMaxLength } = formRules.reviewRules

const contentSchema = z.object({
    rating: z.number({ message: "Please choose a rating from 1 to 5 stars." })
        .int({ message: "Please choose a rating from 1 to 5 stars." })
        .min(1, { message: "Please choose a rating from 1 to 5 stars." })
        .max(5, { message: "Please choose a rating from 1 to 5 stars." }),
    title: z.string({ message: "Please enter a title" }).trim()
        .min(1, { message: "Please enter a title" })
        .max(titleMaxLength.maxLengthValue, { message: titleMaxLength.errorMessage }),
    body: z.string({ message: "Please write a review" }).trim()
        .min(1, { message: "Please write a review" })
        .max(bodyMaxLength.maxLengthValue, { message: bodyMaxLength.errorMessage }),
})

const idSchema = z.string().min(1)

const { reasons, detailsMaxLength } = formRules.reportRules

const reportSchema = z.object({
    reviewId: idSchema,
    reason: z.enum(Object.keys(reasons) as [keyof typeof reasons, ...(keyof typeof reasons)[]], { message: "Please choose a reason." }),
    details: z.string().trim().max(detailsMaxLength.maxLengthValue, { message: detailsMaxLength.errorMessage }).optional(),
}).refine((r) => r.reason !== "other" || !!r.details, { message: "Please describe the problem.", path: ["details"] })

const addSchema = contentSchema.extend({ itemId: idSchema })
const updateSchema = contentSchema.extend({ id: idSchema })
const voteSchema = z.object({ reviewId: idSchema, value: z.union([z.literal(1), z.literal(-1)]) })

const recomputeRating = (itemId: string) => {
    const seed = sql`coalesce(${item.seedRating}, ${item.rating})`
    const weight = sql.raw(String(SEED_WEIGHT))
    const total = sql`coalesce((select sum(${review.rating}) from ${review} where ${review.itemId} = ${item.id}), 0)`
    const reviews = sql`(select count(*) from ${review} where ${review.itemId} = ${item.id})`

    return db
        .update(item)
        .set({
            seedRating: seed,
            rating: sql`(${seed} * ${weight} + ${total}) / (${weight} + ${reviews})`,
        })
        .where(eq(item.id, itemId))
}

const invalid = (error: z.ZodError) => ({ success: false as const, message: error.issues[0]?.message ?? "Invalid input." })

const failed = (message: string, error: unknown) => {
    console.error(message, error)

    return { success: false as const, message }
}

export const addReview = async (input: { itemId: string; rating: number; title: string; body: string }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to leave a review." }
    }

    const parsed = addSchema.safeParse(input)

    if (!parsed.success) {
        return invalid(parsed.error)
    }

    const { itemId, rating, title, body } = parsed.data

    try {
        if (await hasReviewed(itemId, session.user.id)) {
            return { success: false as const, message: "You have already reviewed this weapon." }
        }

        await db.insert(review).values({ itemId, userId: session.user.id, rating, title, body })
        await recomputeRating(itemId)

        return { success: true as const }
    } catch (error) {
        return failed("Could not save your review.", error)
    }
}

export const updateReview = async (input: { id: string; rating: number; title: string; body: string }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to edit a review." }
    }

    const parsed = updateSchema.safeParse(input)

    if (!parsed.success) {
        return invalid(parsed.error)
    }

    const { id, rating, title, body } = parsed.data

    try {
        const [updated] = await db
            .update(review)
            .set({ rating, title, body })
            .where(and(eq(review.id, id), eq(review.userId, session.user.id)))
            .returning({ itemId: review.itemId })

        if (!updated) {
            return { success: false as const, message: "You can only edit your own reviews." }
        }

        await recomputeRating(updated.itemId)

        return { success: true as const }
    } catch (error) {
        return failed("Could not update your review.", error)
    }
}

export const deleteReview = async (reviewId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to delete a review." }
    }

    const parsed = idSchema.safeParse(reviewId)

    if (!parsed.success) {
        return { success: false as const, message: "Invalid review." }
    }

    try {
        const [deleted] = await db
            .delete(review)
            .where(and(eq(review.id, parsed.data), eq(review.userId, session.user.id)))
            .returning({ itemId: review.itemId })

        if (!deleted) {
            return { success: false as const, message: "You can only delete your own reviews." }
        }

        await recomputeRating(deleted.itemId)

        return { success: true as const }
    } catch (error) {
        return failed("Could not delete your review.", error)
    }
}

export const reportReview = async (input: { reviewId: string; reason: string; details?: string }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to report a review." }
    }

    const parsed = reportSchema.safeParse(input)

    if (!parsed.success) {
        return invalid(parsed.error)
    }

    const { reviewId, reason, details } = parsed.data

    try {
        const [target] = await db.select({ userId: review.userId }).from(review).where(eq(review.id, reviewId))

        if (!target) {
            return { success: false as const, message: "That review no longer exists." }
        }

        if (target.userId === session.user.id) {
            return { success: false as const, message: "You can't report your own review." }
        }

        await db
            .insert(reviewReport)
            .values({ reviewId, reporterId: session.user.id, reason, details: reason === "other" ? details : null })
            .onConflictDoNothing()

        return { success: true as const }
    } catch (error) {
        return failed("Could not submit your report.", error)
    }
}

export const voteReview = async (reviewId: string, value: 1 | -1) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to vote." }
    }

    const parsed = voteSchema.safeParse({ reviewId, value })

    if (!parsed.success) {
        return { success: false as const, message: "Invalid vote." }
    }

    try {
        const [existing] = await db
            .select({ value: reviewVote.value })
            .from(reviewVote)
            .where(and(eq(reviewVote.reviewId, parsed.data.reviewId), eq(reviewVote.userId, session.user.id)))

        if (existing?.value === parsed.data.value) {
            await db
                .delete(reviewVote)
                .where(and(eq(reviewVote.reviewId, parsed.data.reviewId), eq(reviewVote.userId, session.user.id)))
        } else {
            await db
                .insert(reviewVote)
                .values({ reviewId: parsed.data.reviewId, userId: session.user.id, value: parsed.data.value })
                .onConflictDoUpdate({ target: [reviewVote.reviewId, reviewVote.userId], set: { value: parsed.data.value } })
        }

        return { success: true as const }
    } catch (error) {
        return failed("Could not save your vote.", error)
    }
}
