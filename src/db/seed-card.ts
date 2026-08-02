"use server";

import * as dotenv from 'dotenv';
import { schema } from './schema';
import { db } from './drizzle';
import { eq } from 'drizzle-orm';

dotenv.config();

async function seed() {
    console.log("Card Seed Started");
  await db.update(schema.item).set({
    id: "dark-moon-greatsword",
    title: "Dark Moon Greatsword",
    imgUrl: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/dark_moon_greatsword_weapon_elden_ring_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: "Moonlight Greatsword",
    fpCost: [32],
    weight: 10.0,
    attributeScaling: ['D', 'D', 'B', '-', '-'],
    attributesRequired: [16, 11, 38, 0, 0],
    passiveEffects: ["Frost Buildup (55)", "-", "-"],
    description:
      "A Moon Greatsword, bestowed by a Carian queen upon her spouse to honor long-standing tradition.\nOne of the legendary armaments.\nRanni's sigil is a full moon, cold and leaden, and this sword is but a beam of its light.",
  })
  .where(eq(schema.item.id, "dark-moon-greatsword"));;

  console.log("Dark Moon Greatsword seeded!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
});