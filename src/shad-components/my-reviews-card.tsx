import Link from "next/link"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/shad-components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/shad-components/ui/item"

export interface MyReview {
  id: string
  rating: number
  title: string
  itemId: string
  itemTitle: string
}

export function MyReviewsCard({ reviews }: { reviews: MyReview[] }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:p-8">
        <h2 className="text-xl font-bold">My reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">You haven&apos;t reviewed any weapons yet.</p>
        ) : (
          <ItemGroup className="max-h-64 overflow-y-auto">
            {reviews.map((r) => (
              <Item key={r.id} asChild variant="outline" className="mb-2">
                <Link href={`/item-card/${r.itemId}`}>
                  <ItemContent>
                    <ItemTitle>{r.itemTitle}</ItemTitle>
                    <ItemDescription>{r.title}</ItemDescription>
                  </ItemContent>
                  <ItemActions className="gap-1 text-sm">
                    <Star className="size-4 fill-primary stroke-primary" aria-hidden />
                    {r.rating}/5
                  </ItemActions>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
