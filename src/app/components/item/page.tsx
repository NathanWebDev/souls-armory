import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/shad-components/ui/item";
import Image from "next/image";

export interface ItemCard {
    id: string,
    title: string,
    imgUrl: string,
    type: string,
    rating: number
}

export interface ItemCardData {
    itemTileData: ItemCard[]
}

export default function ItemTileContainer({itemTileData}: ItemCardData){
    return(
        <div className="w-full px-4 lg:px-8 mt-6">
            <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemTileData.map((tileData: ItemCard, index: number) => (
                    <Item key={index} variant="outline" asChild role="listitem">
                        <a href={"item-card/" + tileData.id}>
                            <ItemMedia>
                                <Image
                                    src={tileData.imgUrl}
                                    alt={`${tileData.title} Image`}
                                    width={32}
                                    height={32}
                                    className="aspect-square object-cover"
                                />
                            </ItemMedia>
                            <ItemContent className="block">
                                <ItemTitle className="font-bold">
                                    {tileData.title}
                                </ItemTitle>
                                <ItemDescription>{tileData.type}</ItemDescription>
                            </ItemContent>
                        </a>
                    </Item>
                ))}
            </ItemGroup>
        </div>
    )
}