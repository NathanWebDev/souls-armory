import { Card, CardContent } from "@/shad-components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/shad-components/ui/item"
import type { ReportedReview } from "@/lib/review-routes"

export function ReportedUsersCard({ reports }: { reports: ReportedReview[] }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:p-8">
        <h2 className="text-xl font-bold">Reported Users</h2>
        {reports.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reported reviews.</p>
        ) : (
          <ItemGroup className="max-h-[440px] overflow-y-auto p-1">
            {reports.map((r) => (
              <Item key={r.id} variant="outline" className="mb-2">
                <ItemContent>
                  <ItemTitle>{r.authorName}</ItemTitle>
                  <ItemDescription>{r.itemTitle}: {r.title}</ItemDescription>
                </ItemContent>
                <ItemActions className="text-sm">
                  {r.reports.length} report{r.reports.length > 1 ? "s" : ""}
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
