import { Card, CardContent, CardFooter, CardHeader } from "@/shad-components/ui/card"
import { Skeleton } from "@/shad-components/ui/skeleton"

export default function ReviewSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-[80px]" />
                    </div>
                </div>
                <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
            </CardContent>
            <CardFooter className="gap-2">
                <Skeleton className="size-8" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="size-8" />
            </CardFooter>
        </Card>
    )
}
