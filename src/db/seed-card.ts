"use server";

import * as dotenv from 'dotenv';
import { schema } from './schema';
import { db } from './drizzle';

dotenv.config();

async function seed() {
  console.log("Card Seed Started");

  await db.insert(schema.item).values({
    id: "dark-moon-greatsword",
    title: "Dark Moon Greatsword",
    gameTitle: "Elden Ring",
    imgUrl: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/dark_moon_greatsword_weapon_elden_ring_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: "Moonlight Greatsword",
    fpCost: [32],
    weight: 10.0,
    attributeScaling: ["D", "D", "B", "-", "-"],
    attributesRequired: [16, 11, 38, 0, 0],
    passiveEffects: ["Frost Buildup (55)", "-", "-"],
    description:
      "A Moon Greatsword, bestowed by a Carian queen upon her spouse to honor long-standing tradition.\nOne of the legendary armaments.\nRanni's sigil is a full moon, cold and leaden, and this sword is but a beam of its light.",
  });

  console.log("Dark Moon Greatsword seeded!");

  await db.insert(schema.item).values({
    id: "blasphemous-blade",
    title: "Blasphemous Blade",
    gameTitle: "Elden Ring",
    imgUrl: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/blasphemous_blade_weapon_elden_ring_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: "Taker's Flames",
    fpCost: [30],
    weight: 13.5,
    attributeScaling: ["D", "D", "C", "-", "-"],
    attributesRequired: [22, 15, 21, 0, 0],
    passiveEffects: ["Restores HP on defeating enemies", "-", "-"],
    description:
      "Sacred sword of Rykard, Lord of Blasphemy.\nRemains of the countless heroes he has devoured writhe upon the surface of this blade.",
  });

  console.log("Blasphemous Blade seeded!");

  await db.insert(schema.item).values({
    id: "rivers-of-blood",
    title: "Rivers of Blood",
    gameTitle: "Elden Ring",
    imgUrl: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/rivers_of_blood_katana_weapon_elden_ring_wiki_guide_200px.png",
    type: "Katana",
    rating: 5,
    weaponArt: "Corpse Piler",
    fpCost: [17],
    weight: 6.5,
    attributeScaling: ["E", "D", "-", "D", "-"],
    attributesRequired: [12, 18, 0, 20, 0],
    passiveEffects: ["Blood Loss Buildup (52)", "-", "-"],
    description:
      "Weapon of Okina, swordsman from the Land of Reeds.\nA cursed weapon that thirsts endlessly for blood.",
  });

  console.log("Rivers of Blood seeded!");

  await db.insert(schema.item).values({
    id: "moonveil",
    title: "Moonveil",
    gameTitle: "Elden Ring",
    imgUrl: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/moonveil_katana_weapon_elden_ring_wiki_guide_200px.png",
    type: "Katana",
    rating: 5,
    weaponArt: "Transient Moonlight",
    fpCost: [15, 20],
    weight: 6.5,
    attributeScaling: ["E", "D", "C", "-", "-"],
    attributesRequired: [12, 18, 23, 0, 0],
    passiveEffects: ["Blood Loss Buildup (50)", "-", "-"],
    description:
      "Katana forged of glintstone.\nMasterpiece of a Sellian swordsmith whose name has been lost.",
  });

  console.log("Moonveil seeded!");

  console.log("Card Seed Complete");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
});