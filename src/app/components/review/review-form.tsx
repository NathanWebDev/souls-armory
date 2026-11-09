"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { formRules } from "@/app/components/form-rules"
import { addReview } from "@/server/reviews"
import { cn } from "@/lib/utils"
import { Button } from "@/shad-components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/shad-components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shad-components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shad-components/ui/form"
import { Input } from "@/shad-components/ui/input"
import { Textarea } from "@/shad-components/ui/textarea"

const { titleMaxLength, bodyMaxLength } = formRules.reviewRules

const reviewFormSchema = z.object({
    rating: z.number().int().min(1, { message: "Please choose a rating" }).max(5),
    title: z.string().trim()
        .min(1, { message: "Please enter a title" })
        .max(titleMaxLength.maxLengthValue, { message: titleMaxLength.errorMessage }),
    body: z.string().trim()
        .min(1, { message: "Please write a review" })
        .max(bodyMaxLength.maxLengthValue, { message: bodyMaxLength.errorMessage }),
})

function StarInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    const [hover, setHover] = useState(0)
    const shown = hover || value

    return (
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={value === star}
                    className="size-8 cursor-pointer"
                    onMouseEnter={() => setHover(star)}
                    onClick={() => onChange(star)}
                >
                    <Star className={cn("size-full stroke-primary stroke-[1.5]", shown >= star ? "fill-primary" : "fill-transparent")} />
                </button>
            ))}
        </div>
    )
}

export default function ReviewForm({ itemId, signedIn }: { itemId: string; signedIn: boolean }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof reviewFormSchema>>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: { rating: 0, title: "", body: "" },
    })

    async function onSubmit(values: z.infer<typeof reviewFormSchema>) {
        const result = await addReview({ itemId, ...values })

        if (!result.success) {
            toast.error(result.message)
            return
        }

        toast.success("Review posted")
        form.reset()
        setOpen(false)
        router.refresh()
    }

    if (!signedIn) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Write a review</CardTitle>
                    <CardDescription>
                        <Link href="/user/login" className="underline">Sign in</Link> to review this weapon.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) form.reset() }}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-fit">Write a Review</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Write a review</DialogTitle>
                    <DialogDescription className="sr-only">Rate this weapon and share your thoughts.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <StarInput value={field.value} onChange={field.onChange} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sum up your review" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="What did you think of this weapon?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                Post review
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
