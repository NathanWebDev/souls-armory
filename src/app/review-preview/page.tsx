import ReviewForm from "@/app/components/review/review-form"

export default function ReviewPreviewPage() {
    return (
        <div className="w-[600px] flex flex-col gap-6 mt-10">
            <ReviewForm itemId="preview" signedIn />
            <ReviewForm itemId="preview" signedIn={false} />
        </div>
    )
}
