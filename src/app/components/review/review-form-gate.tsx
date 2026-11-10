import ReviewForm from "@/app/components/review/review-form"
import { hasReviewed } from "@/lib/review-routes"

export default async function ReviewFormGate({ itemId, userId }: { itemId: string; userId?: string }) {
    if (userId && await hasReviewed(itemId, userId)) return null
    return <ReviewForm itemId={itemId} signedIn={!!userId} />
}
