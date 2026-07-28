import Image from "next/image";
import { Card, CardDescription, CardHeader } from "@/shad-components/ui/card";
import ItemNotFound from "@/app/components/item-not-found/page";
import { Separator } from "@/shad-components/ui/separator";
import { Skeleton } from "@/shad-components/ui/skeleton";

import StarContainer from "../../components/star-container/page";
import { getFullCard } from "@/lib/item-routes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export interface CardProps {
    id: string,
    title: string,
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

export default async function ItemCardPage({ params }: PageProps) {
    const { id } = await params;
    const fullCardData = await getFullCard(id);
    if (!Number.isNaN(id)){
        return (
            <div className="w-[600px] flex flex-col gap-6 mt-10">
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        {fullCardData.title}
                        <StarContainer rating={fullCardData.rating} className="w-24 h-8"></StarContainer>
                    </CardHeader>
                    <div className="flex place-content-between">
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
                                            {fullCardData.fpCost}( &emsp; - &emsp; -)
                                        </CardDescription>
                                    </div>
                                    <div className="flex place-content-between w-[200px]">
                                        <CardDescription>
                                            Weight
                                        </CardDescription>
                                        <CardDescription>
                                            {fullCardData.weight}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </Separator>
                        <Image className="flex-end mr-10"
                        src={'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dark_moon_greatsword_weapon_elden_ring_wiki_guide_200px.png'}
                        alt="Moonlight Greatsword Image"
                        width={128}
                        height={128}>
                        </Image>
                    </div>
                    <div className="w-[500px] attr-container grid grid-cols-2 ml-8">
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

                            </Separator>
                        </div>
                        <div className="attr-required ml-[100px]">
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

                            </Separator>
                        </div>
                        <div className="passive-effects mt-[50px]">
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

                        </Separator>
                    </div>
                    </div>
                    <Separator />
                    <CardHeader>
                        Description:
                        <CardDescription className="whitespace-pre-wrap">
                            <p>{fullCardData.description}</p>
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

    return (
        <>
            <ItemNotFound />
        </>
    )
}