import { getAllItems } from "../../lib/item-routes"
import ItemTileContainer from "@/app/components/item/page"


export default async function Home() {
  const itemTileData = await getAllItems();

  return (
    <>
      <ItemTileContainer itemTileData={itemTileData}/>
    </>
  )
}
