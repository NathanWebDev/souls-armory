import Image from "next/image";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItemCardPage() {
    return (
        <div className="w-[600px] flex flex-col gap-6 mt-10">
            <Card className="w-full">
                <CardHeader>
                    Moonlight Greatsword
                </CardHeader>
                <div className="flex place-content-between">
                    <Separator orientation="vertical" className="ml-8">
                        <CardDescription className="w-50 ml-5">
                            This is some text
                        </CardDescription>
                        <CardDescription className="w-50 ml-5">
                            This is some more text
                        </CardDescription>
                    </Separator>
                    <Image className="flex-end mr-10"
                    src={'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dark_moon_greatsword_weapon_elden_ring_wiki_guide_200px.png'}
                    alt="Moonlight Greatsword Image"
                    width={128}
                    height={128}>
                    </Image>
                </div>
                <Separator />
                <CardHeader>
                    Description:
                    <CardDescription>
                    Descriptive text talking about the card
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    )
}