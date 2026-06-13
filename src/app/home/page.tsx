"use client"

import ItemTileContainer from "@/app/components/item/page"

const itemTileData = [
  {
    id: 1,
    title: 'Dark Moon Greatsword',
    imgUrl: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dark_moon_greatsword_weapon_elden_ring_wiki_guide_200px.png',
    type: 'Greatsword'
  }
]

export default function Home() {
  return (
    <>
      <ItemTileContainer itemTileData={itemTileData}/>
    </>
  )
}
