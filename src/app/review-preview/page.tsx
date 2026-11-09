import ReviewCard from "@/app/components/review/review-card"
import ReviewSkeleton from "@/app/components/review/review-skeleton"

export default function ReviewPreviewPage() {
    return (
        <div className="w-[600px] flex flex-col gap-6 mt-10">
            <ReviewCard
                review={{
                    id: "1",
                    rating: 4,
                    title: "Great early-game pickup",
                    body: "Scales well and the weapon art is excellent.\nWould recommend to anyone building around dexterity.",
                    createdAt: new Date("2026-11-01"),
                    authorName: "Tarnished Fan",
                    authorImage: null,
                    upvotes: 12,
                    downvotes: 3,
                    viewerVote: 1,
                }}
            />
            <ReviewSkeleton />
        </div>
    )
}
