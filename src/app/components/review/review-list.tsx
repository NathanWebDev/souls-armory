import { getReviews } from "@/server/reviews"
import ReviewCard from "@/app/components/review/review-card"
import { CardDescription } from "@/shad-components/ui/card"

export default async function ReviewList({ itemId }: { itemId: string }) {
    const reviews = await getReviews(itemId)

    if (!reviews.length) {
        return <CardDescription>No reviews yet. Be the first to review this weapon.</CardDescription>
    }

    return reviews.map((review) => <ReviewCard key={review.id} review={review} />)
}
