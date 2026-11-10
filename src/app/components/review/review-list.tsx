import { getReviews } from "@/lib/review-routes"
import ReviewCard from "@/app/components/review/review-card"
import { CardDescription } from "@/shad-components/ui/card"

export default async function ReviewList({ itemId, viewerId }: { itemId: string; viewerId?: string }) {
    const reviews = await getReviews(itemId, viewerId)

    if (!reviews.length) {
        return <CardDescription>No reviews yet. Be the first to review this weapon.</CardDescription>
    }

    return reviews.map((review) => <ReviewCard key={review.id} review={review} signedIn={!!viewerId} />)
}
