import { getAllItems } from "../../lib/item-routes"
import ItemTileContainer from "@/app/components/item/page"

interface HomeProps {
  searchParams: Promise<{ game?: string | string[] }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const game = Array.isArray(params.game) ? params.game[0] : params.game;
  const itemTileData = await getAllItems(game);

  if (itemTileData.length === 0) {
    return (
      <p className="w-full px-4 lg:px-8 mt-6 text-muted-foreground">
        No items for this game yet.
      </p>
    )
  }

  return (
    <>
      <ItemTileContainer itemTileData={itemTileData}/>
    </>
  )
}
