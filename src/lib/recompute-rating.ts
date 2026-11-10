import { eq, sql } from "drizzle-orm"

import { db } from "@/db/drizzle"
import { item, review } from "@/db/schema"
import { SEED_WEIGHT } from "@/lib/rating"

export const recomputeRating = (itemId: string) => {
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
