"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { banReportedUser, deleteReportedReview, ignoreReports } from "@/server/admin"
import { Button } from "@/shad-components/ui/button"

import { formRules } from "@/app/components/form-rules"
import StarContainer from "@/app/components/star-container/page"
import type { ReportedReview } from "@/lib/review-routes"
import { Avatar, AvatarFallback, AvatarImage } from "@/shad-components/ui/avatar"
import { Card, CardContent } from "@/shad-components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shad-components/ui/dialog"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/shad-components/ui/item"
import { getInitials } from "@/lib/utils"

const reasonLabels: Record<string, string> = formRules.reportRules.reasons

export function ReportedUsersCard({ reports }: { reports: ReportedReview[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = reports.find((r) => r.id === selectedId)
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const run = (action: (reviewId: string) => Promise<{ success: boolean; message?: string }>, reviewId: string) =>
    startTransition(async () => {
      const result = await action(reviewId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      setSelectedId(null)
      router.refresh()
    })

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:p-8">
        <h2 className="text-xl font-bold">Reported Users</h2>
        {reports.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reported reviews.</p>
        ) : (
          <ItemGroup className="max-h-[440px] overflow-y-auto p-1">
            {reports.map((r) => (
              <Item key={r.id} asChild variant="outline" className="mb-2">
                <button type="button" className="cursor-pointer text-left" onClick={() => setSelectedId(r.id)}>
                  <ItemContent>
                    <ItemTitle>{r.authorName}</ItemTitle>
                    <ItemDescription>{r.itemTitle}: {r.title}</ItemDescription>
                  </ItemContent>
                  <ItemActions className="text-sm">
                    {r.reports.length} report{r.reports.length > 1 ? "s" : ""}
                  </ItemActions>
                </button>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.itemTitle} · {selected.createdAt.toLocaleDateString()}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={selected.authorImage ?? undefined} alt={selected.authorName} />
                    <AvatarFallback>{getInitials(selected.authorName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {selected.authorName}
                    {selected.authorBanned && <span className="text-muted-foreground"> (banned)</span>}
                  </span>
                </div>
                <StarContainer rating={selected.rating} className="w-24 h-8" />
              </div>
              <p className="whitespace-pre-wrap text-sm">{selected.body}</p>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Reports ({selected.reports.length})</h3>
                <ul className="flex flex-col gap-1 text-sm">
                  {selected.reports.map((report, i) => (
                    <li key={i}>
                      {reasonLabels[report.reason] ?? report.reason}
                      {report.details && <span className="text-muted-foreground">: {report.details}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" disabled={pending} onClick={() => run(ignoreReports, selected.id)}>Ignore</Button>
                <Button variant="destructive" disabled={pending} onClick={() => run(deleteReportedReview, selected.id)}>Delete Review</Button>
                <Button variant="destructive" disabled={pending || selected.authorBanned} onClick={() => run(banReportedUser, selected.id)}>Ban User</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
