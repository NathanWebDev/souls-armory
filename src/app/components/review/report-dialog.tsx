"use client"

import { useState } from "react"
import { toast } from "sonner"

import { formRules } from "@/app/components/form-rules"
import { reportReview } from "@/server/reviews"
import { Button } from "@/shad-components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shad-components/ui/dialog"
import { Label } from "@/shad-components/ui/label"
import { Textarea } from "@/shad-components/ui/textarea"

const { reasons, detailsMaxLength } = formRules.reportRules

interface ReportDialogProps {
    reviewId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ReportDialog({ reviewId, open, onOpenChange }: ReportDialogProps) {
    const [reason, setReason] = useState("")
    const [details, setDetails] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setReason("")
            setDetails("")
        }
        onOpenChange(next)
    }

    async function submit(event: React.FormEvent) {
        event.preventDefault()
        setSubmitting(true)
        const result = await reportReview({ reviewId, reason, details })
        setSubmitting(false)

        if (!result.success) {
            toast.error(result.message)
            return
        }

        toast.success("Report submitted. Thank you.")
        handleOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report User</DialogTitle>
                    <DialogDescription>Tell us what is wrong with this review or its author.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div role="radiogroup" aria-label="Report reason" className="flex flex-col gap-3">
                        {Object.entries(reasons).map(([value, label]) => (
                            <Label key={value} className="cursor-pointer gap-2">
                                <input
                                    type="radio"
                                    name="reason"
                                    value={value}
                                    checked={reason === value}
                                    onChange={() => setReason(value)}
                                    className="accent-primary"
                                />
                                {label}
                            </Label>
                        ))}
                    </div>
                    {reason === "other" && (
                        <Textarea
                            aria-label="Describe the problem"
                            placeholder="Describe the problem"
                            maxLength={detailsMaxLength.maxLengthValue}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={submitting || !reason || (reason === "other" && !details.trim())}>
                            Submit report
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
