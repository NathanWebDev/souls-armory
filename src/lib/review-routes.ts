import { and, desc, eq, inArray, sql } from "drizzle-orm"

import { db } from "@/db/drizzle"
import { review, reviewVote, user } from "@/db/schema"

const reviewLimit = Number(process.env.REVIEW_LIMIT) || 10

export const hasReviewed = async (itemId: string, userId: string) =>
    !!(await db.select({ id: review.id }).from(review)
        .where(and(eq(review.itemId, itemId), eq(review.userId, userId))).limit(1)).length

export const getReviews = async (itemId: string, viewerId: string = "") => {
    const votes = db
        .select({
            reviewId: reviewVote.reviewId,
            upvotes: sql<number>`count(*) filter (where ${reviewVote.value} = 1)`.mapWith(Number).as("upvotes"),
            downvotes: sql<number>`count(*) filter (where ${reviewVote.value} = -1)`.mapWith(Number).as("downvotes"),
            viewerVote: sql<number>`coalesce(max(case when ${reviewVote.userId} = ${viewerId} then ${reviewVote.value} end), 0)`.mapWith(Number).as("viewer_vote"),
        })
        .from(reviewVote)
        .where(inArray(reviewVote.reviewId, db.select({ id: review.id }).from(review).where(eq(review.itemId, itemId))))
        .groupBy(reviewVote.reviewId)
        .as("votes")

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
            upvotes: sql<number>`coalesce(${votes.upvotes}, 0)`.mapWith(Number),
            downvotes: sql<number>`coalesce(${votes.downvotes}, 0)`.mapWith(Number),
            viewerVote: sql<number>`coalesce(${votes.viewerVote}, 0)`.mapWith(Number),
        })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .leftJoin(votes, eq(votes.reviewId, review.id))
        .where(eq(review.itemId, itemId))
        .orderBy(desc(review.createdAt))
        .limit(reviewLimit)
}
