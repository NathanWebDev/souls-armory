import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Rating {
    rating: number
    className?: string
}

export default function StarContainer({ rating, className }: Rating) {
    const starContainer = [];

    for (let i = 0; i < 5; i++) {
        const fullStar = rating >= i + 1;
        const halfStar = rating >= i + 0.5 && rating < i + 1;

        if (fullStar) {
            starContainer.push(
                <Star
                    key={i}
                    className="size-full stroke-primary fill-primary stroke-[1.5]"
                />
            );
        } else if (halfStar) {
            starContainer.push(
                <div key={i} className="relative size-full">
                    <Star
                        className="absolute inset-0 size-full stroke-primary fill-transparent stroke-[1.5]"
                    />

                    <Star
                        className="absolute inset-0 size-full stroke-primary fill-primary stroke-[1.5]"
                        style={{
                            clipPath: "inset(0 50% 0 0)"
                        }}
                    />
                </div>
            );
        } else {
            starContainer.push(
                <Star
                    key={i}
                    className="size-full stroke-primary fill-transparent stroke-[1.5]"
                />
            );
        }
    }

    return (
        <div className={cn("flex gap-1 size-5", className)}>
            {starContainer}
        </div>
    );
}