import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import Image from "next/image";

interface ItemCard {
    id: number,
    title: string,
    imgUrl: string,
    type: string
}

interface ItemCardData {
    itemTileData: ItemCard[]
}

export default function ItemTileContainer({itemTileData}: ItemCardData){
    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-4 mx-15 md:mx-4 lg:mx-4">
                <ItemGroup>
                    {itemTileData.map((tileData: ItemCard, index: number) => (
                        <Item key={index} variant="outline" asChild role="listitem">
                            <a href={"item-card/" + tileData.id}>
                                <ItemMedia>
                                <Image 
                                    src={tileData.imgUrl} 
                                    alt={tileData.title + " Image"}
                                    width={32}
                                    height={32} 
                                    className="aspect-square object-cover" 
                                />
                                </ItemMedia>
                                <ItemContent className="block">
                                    <ItemTitle className="font-bold">{tileData.title}</ItemTitle>
                                    <ItemDescription>{tileData.type}</ItemDescription>
                                </ItemContent>
                            </a>
                        </Item>
                    ))}
                </ItemGroup>
            </div>
        </>
    )
}