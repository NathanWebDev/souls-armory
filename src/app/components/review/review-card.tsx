"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/shad-components/ui/avatar"
import { Button } from "@/shad-components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shad-components/ui/card"
import StarContainer from "@/app/components/star-container/page"
import { voteReview } from "@/server/reviews"
import { cn, getInitials } from "@/lib/utils"

export interface ReviewData {
    id: string
    rating: number
    title: string
    body: string
    createdAt: Date
    authorName: string
    authorImage: string | null
    upvotes: number
    downvotes: number
    viewerVote: number
}

export default function ReviewCard({ review }: { review: ReviewData }) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    const vote = (value: 1 | -1) =>
        startTransition(async () => {
            const result = await voteReview(review.id, value)

            if (!result.success) {
                toast.error(result.message)
                return
            }

            router.refresh()
        })

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                        <AvatarImage src={review.authorImage ?? undefined} alt={review.authorName} />
                        <AvatarFallback>{getInitials(review.authorName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <CardTitle>{review.authorName}</CardTitle>
                        <CardDescription>{review.createdAt.toLocaleDateString()}</CardDescription>
                    </div>
                </div>
                <StarContainer rating={review.rating} className="w-24 h-8" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <CardTitle>{review.title}</CardTitle>
                <CardDescription className="whitespace-pre-wrap">{review.body}</CardDescription>
            </CardContent>
            <CardFooter className="gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={pending}
                    aria-label="Upvote"
                    aria-pressed={review.viewerVote === 1}
                    onClick={() => vote(1)}
                >
                    <ThumbsUp className={cn(review.viewerVote === 1 && "fill-primary")} />
                </Button>
                <span className="min-w-6 -translate-x-3 text-center text-sm">{review.upvotes}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={pending}
                    aria-label="Downvote"
                    aria-pressed={review.viewerVote === -1}
                    onClick={() => vote(-1)}
                >
                    <ThumbsDown className={cn(review.viewerVote === -1 && "fill-primary")} />
                </Button>
                <span className="min-w-6 -translate-x-3 text-center text-sm">{review.downvotes}</span>
            </CardFooter>
        </Card>
    )
}
