import { Suspense } from "react";
import { headers } from "next/headers";
import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shad-components/ui/card";
import ItemNotFound from "@/app/components/item-not-found/page";
import { Separator } from "@/shad-components/ui/separator";
import ReviewFormGate from "@/app/components/review/review-form-gate";
import ReviewList from "@/app/components/review/review-list";
import ReviewSkeleton from "@/app/components/review/review-skeleton";
import { auth } from "@/lib/auth";
import { Toaster } from "@/shad-components/ui/sonner";

import StarContainer from "../../components/star-container/page";
import { getFullCard } from "@/lib/item-routes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export interface CardProps {
    id: string,
    title: string,
    gameTitle: string,
    imgUrl: string,
    type: string,
    rating: number,
    weaponArt: string | null;
    fpCost: number[] | null;
    weight: number;
    attributeScaling: string[] | null;
    attributesRequired: number[] | null;
    passiveEffects: string[] | null;
    description: string;
}

const attributeLabels: string[] = ['Str', 'Dex', 'Int', 'Fai', 'Arc'];

export default async function ItemCardPage({ params }: PageProps) {
    const { id } = await params;
    const fullCardData = await getFullCard(id);
    const session = await auth.api.getSession({ headers: await headers() });
    if (fullCardData){
        return (
            <>
            <div className="w-full max-w-[600px] px-4 md:px-0 flex flex-col gap-6 my-10">
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{fullCardData.title}<CardDescription className="mt-2">{fullCardData.gameTitle}</CardDescription></CardTitle>
                        <StarContainer rating={fullCardData.rating} className="w-24 h-8"></StarContainer>
                    </CardHeader>
                    <div className="flex flex-col md:flex-row place-content-between">
                        <Separator orientation="vertical" className="ml-8">
                            <div className="type-attack ml-5">
                                <CardDescription className="w-50">
                                    {fullCardData.type}
                                </CardDescription>
                                <CardDescription className="w-50">
                                    Standard/Pierce
                                </CardDescription>
                            </div>
                            <div className="mt-10 ml-5">
                                <CardDescription className="w-50">
                                    {fullCardData.weaponArt}
                                </CardDescription>
                                <div>
                                    <div className="flex place-content-between w-[200px]">
                                        <CardDescription>
                                            FP Cost
                                        </CardDescription>
                                        <CardDescription>
                                            {fullCardData.fpCost && (
                                            <>
                                                {fullCardData.fpCost[0] > 0 ? fullCardData.fpCost[0] : "-"}
                                                {"( \u2003"}
                                                {fullCardData.fpCost[1] > 0 ? fullCardData.fpCost[1] : "-"}
                                                {" \u2003 "}
                                                {fullCardData.fpCost[2] > 0 ? fullCardData.fpCost[2] : "-"}
                                                {")"}
                                            </>
                                        )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex place-content-between w-[200px]">
                                        <CardDescription>
                                            Weight
                                        </CardDescription>
                                        <CardDescription>
                                            {fullCardData.weight.toFixed(1)}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </Separator>
                        <Image className="flex-end md:mr-10 self-center mt-6 md:mt-0"
                        src={fullCardData.imgUrl}
                        alt={fullCardData.title}
                        width={128}
                        height={128}>
                        </Image>
                    </div>
                    <div className="md:w-[500px] attr-container grid grid-cols-1 md:grid-cols-2 ml-8 mr-8 md:mr-0">
                        <div className="attr-scaling">
                            <CardDescription className="flex">
                                <Image
                                className="mr-5 -ml-2"
                                src={`/icons/attribute_scaling.png`}
                                alt="Attributes Required Icon"
                                width={14}
                                height={14}>
                                </Image>
                                Attribute Scaling
                                </CardDescription>
                            <Separator orientation="vertical">
                                <div className="grid grid-cols-2 gap-x-24 gap-y-4 ml-4 mt-4">
                                    {fullCardData.attributeScaling?.map((attr: string, index: number) => (
                                        <div
                                            key={`attr-${attributeLabels[index]}`}
                                            className="grid grid-cols-[60px_auto] items-center"
                                            >
                                            <CardTitle>{attributeLabels[index]}</CardTitle>
                                            <CardTitle className="text-right">{attr}</CardTitle>
                                        </div>
                                    ))}
                                </div>
                            </Separator>
                        </div>
                        <div className="attr-required mt-12 md:mt-0 md:ml-[100px]">
                            <CardDescription className="flex">
                                <Image
                                className="mr-5 -ml-2"
                                src={`/icons/attributes_required.png`}
                                alt="Attributes Required Icon"
                                width={14}
                                height={14}>
                                </Image>
                                Attributes Required
                                </CardDescription>
                            <Separator orientation="vertical">
                                <div className="grid grid-cols-2 gap-x-24 gap-y-4 ml-4 mt-4">
                                    {fullCardData.attributesRequired?.map((attr: number, index: number) => (
                                        <div
                                            key={`attr-${attributeLabels[index]}`}
                                            className="grid grid-cols-[60px_auto] items-center"
                                            >
                                            <CardTitle>{attributeLabels[index]}</CardTitle>
                                            <CardTitle className="text-right">{attr}</CardTitle>
                                        </div>
                                    ))}
                                </div>
                            </Separator>
                        </div>
                        <div className="passive-effects mt-12 md:mt-[50px]">
                        <CardDescription className="flex">
                            <Image
                            className="mr-5 -ml-1.5"
                            src={`/icons/passive_effects.png`}
                            alt="Attributes Required Icon"
                            width={14}
                            height={14}>
                            </Image>
                            Passive Effects
                        </CardDescription>
                        <Separator orientation="vertical">
                            <div className="flex flex-col w-full gap-2 ml-4 mt-4">
                                {fullCardData.passiveEffects?.map((effect: string, index: number) => (
                                <CardTitle
                                    key={`passive-effect-${index}`}
                                    className="w-full whitespace-nowrap"
                                >
                                    {effect}
                                </CardTitle>
                                ))}
                            </div>
                        </Separator>
                    </div>
                    </div>
                    <Separator className="mt-12" />
                    <CardHeader>
                        Description:
                        <CardDescription className="whitespace-pre-wrap">
                            <p>{fullCardData.description}</p>
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Suspense>
                    <ReviewFormGate itemId={fullCardData.id} userId={session?.user.id} />
                </Suspense>
                <Suspense fallback={<ReviewSkeleton />}>
                    <ReviewList itemId={fullCardData.id} viewerId={session?.user.id} />
                </Suspense>
            </div>
            <Toaster />
            </>
        )
    }

    return (
        <>
            <ItemNotFound />
        </>
    )
}