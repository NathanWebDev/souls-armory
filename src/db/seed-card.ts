"use server";

import 'dotenv/config';
import { schema } from './schema';
import { db } from './drizzle';

type NewItem = typeof schema.item.$inferInsert;

async function upsertItem(values: NewItem) {
  const { id, ...updates } = values;

  await db
    .insert(schema.item)
    .values(values)
    .onConflictDoUpdate({ target: schema.item.id, set: updates });
}

async function seed() {
  console.log("Card Seed Started");

  await upsertItem({
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

  console.log("Dark Moon Greatsword upserted!");

  await upsertItem({
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

  console.log("Blasphemous Blade upserted!");

  await upsertItem({
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

  console.log("Rivers of Blood upserted!");

  await upsertItem({
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

  console.log("Moonveil upserted!");

  await upsertItem({
    id: "saw-cleaver",
    title: "Saw Cleaver",
    gameTitle: "Bloodborne",
    imgUrl: "https://bloodborne.wiki.fextralife.com/file/Bloodborne/saw_cleaver_weapon_bloodborne_wiki_guide_200px.png",
    type: "Trick Weapon",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 6.0,
    attributeScaling: ["D", "D", "-", "-", "-"],
    attributesRequired: [10, 10, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A cleaver with a serrated blade that unfolds into a longer, sweeping saw.\nA hunter favorite for its speed and reach.",
  });

  console.log("Saw Cleaver upserted!");

  await upsertItem({
    id: "threaded-cane",
    title: "Threaded Cane",
    gameTitle: "Bloodborne",
    imgUrl: "https://bloodborne.wiki.fextralife.com/file/Bloodborne/threaded_cane_weapon_bloodborne_wiki_guide_200px.png",
    type: "Trick Weapon",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 5.5,
    attributeScaling: ["E", "C", "-", "-", "-"],
    attributesRequired: [8, 12, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A cane that whips out into a lashing, segmented chain.\nElegant, quick, and deadly at mid range.",
  });

  console.log("Threaded Cane upserted!");

  await upsertItem({
    id: "ludwigs-holy-blade",
    title: "Ludwig's Holy Blade",
    gameTitle: "Bloodborne",
    imgUrl: "https://bloodborne.wiki.fextralife.com/file/Bloodborne/ludwigs_holy_blade_weapon_bloodborne_wiki_guide_200px.png",
    type: "Trick Weapon",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 9.0,
    attributeScaling: ["D", "D", "-", "-", "-"],
    attributesRequired: [16, 14, 0, 0, 0],
    passiveEffects: ["Bonus damage against beasts", "-", "-"],
    description:
      "A greatsword that joins to a second blade to double its length.\nBears a holy sheen against beasts.",
  });

  console.log("Ludwig's Holy Blade upserted!");

  await upsertItem({
    id: "kirkhammer",
    title: "Kirkhammer",
    gameTitle: "Bloodborne",
    imgUrl: "https://bloodborne.wiki.fextralife.com/file/Bloodborne/kirkhammer_weapon_bloodborne_wiki_guide_200px.png",
    type: "Trick Weapon",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 8.0,
    attributeScaling: ["D", "D", "-", "-", "-"],
    attributesRequired: [14, 14, 0, 0, 0],
    passiveEffects: ["Bonus damage against beasts", "-", "-"],
    description:
      "A blade that folds into a heavy hammer.\nA well-balanced weapon for fighting beasts.",
  });

  console.log("Kirkhammer upserted!");

  await upsertItem({
    id: "blade-of-mercy",
    title: "Blade of Mercy",
    gameTitle: "Bloodborne",
    imgUrl: "https://bloodborne.wiki.fextralife.com/file/Bloodborne/blade_of_mercy_weapon_bloodborne_wiki_guide_200px.png",
    type: "Trick Weapon",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 5.0,
    attributeScaling: ["-", "C", "-", "-", "-"],
    attributesRequired: [0, 16, 0, 0, 0],
    passiveEffects: ["Bonus damage against beasts", "-", "-"],
    description:
      "A sharp, thin blade that transforms into a larger sword.\nFavors skill and quick strikes.",
  });

  console.log("Blade of Mercy upserted!");

  await upsertItem({
    id: "moonlight-greatsword-ds3",
    title: "Moonlight Greatsword",
    gameTitle: "Dark Souls 3",
    imgUrl: "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/moonlight_greatsword_weapon_dark_souls_3_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: "Wave of Moonlight",
    fpCost: [20, 1],
    weight: 6.5,
    attributeScaling: ["-", "-", "B", "-", "-"],
    attributesRequired: [12, 0, 26, 0, 0],
    passiveEffects: ["Magic Damage", "-", "-"],
    description:
      "A greatsword steeped in moonlight, long held as a relic of the old gods.\nIts glintstone edge cuts with pure magic.",
  });

  console.log("Moonlight Greatsword upserted!");

  await upsertItem({
    id: "farron-greatsword",
    title: "Farron Greatsword",
    gameTitle: "Dark Souls 3",
    imgUrl: "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/farron_greatsword_weapon_dark_souls_3_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: "Stance of the Abyss Watchers",
    fpCost: [10, 1],
    weight: 10.0,
    attributeScaling: ["C", "C", "-", "-", "-"],
    attributesRequired: [16, 18, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A greatsword wielded by those who guard the Undead Legion.\nIts weight demands conviction.",
  });

  console.log("Farron Greatsword upserted!");

  await upsertItem({
    id: "sellsword-twinblades",
    title: "Sellsword Twinblades",
    gameTitle: "Dark Souls 3",
    imgUrl: "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sellsword_twinblades_weapon_dark_souls_3_wiki_guide_200px.png",
    type: "Curved Sword",
    rating: 4,
    weaponArt: "Flurry",
    fpCost: [10, 1],
    weight: 4.0,
    attributeScaling: ["E", "B", "-", "-", "-"],
    attributesRequired: [10, 18, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "Paired swords favored by mercenaries.\nFast, light, and well suited to a quick-footed fighter.",
  });

  console.log("Sellsword Twinblades upserted!");

  await upsertItem({
    id: "dancers-enchanted-swords",
    title: "Dancer's Enchanted Swords",
    gameTitle: "Dark Souls 3",
    imgUrl: "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dancers_enchanted_swords_weapon_dark_souls_3_wiki_guide_200px.png",
    type: "Curved Sword",
    rating: 5,
    weaponArt: "Dancer's Rapture",
    fpCost: [10, 1],
    weight: 3.5,
    attributeScaling: ["-", "C", "-", "-", "-"],
    attributesRequired: [10, 20, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "Swords wielded by a boss who never stops moving.\nA dancing flurry of rapid strikes.",
  });

  console.log("Dancer's Enchanted Swords upserted!");

  await upsertItem({
    id: "profaned-greatsword",
    title: "Profaned Greatsword",
    gameTitle: "Dark Souls 3",
    imgUrl: "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/profaned_greatsword_weapon_dark_souls_3_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 4,
    weaponArt: "Profaned Flame",
    fpCost: [30, 1],
    weight: 9.0,
    attributeScaling: ["C", "-", "-", "-", "-"],
    attributesRequired: [16, 0, 0, 0, 0],
    passiveEffects: ["Fire Damage", "-", "-"],
    description:
      "A heavy, rune-etched greatsword of the Profaned Capital.\nBurns with a cruel, searing flame.",
  });

  console.log("Profaned Greatsword upserted!");

  await upsertItem({
    id: "mastodon-greatsword",
    title: "Mastodon Greatsword",
    gameTitle: "Dark Souls 2",
    imgUrl: "https://darksouls2.wiki.fextralife.com/file/Dark-Souls-2/mastodon_greatsword_weapon_dark_souls_2_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 14.0,
    attributeScaling: ["C", "-", "-", "-", "-"],
    attributesRequired: [26, 0, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A huge blade of ancient design.\nIts weight makes it slow, but each hit lands hard.",
  });

  console.log("Mastodon Greatsword upserted!");

  await upsertItem({
    id: "smelter-sword",
    title: "Smelter Sword",
    gameTitle: "Dark Souls 2",
    imgUrl: "https://darksouls2.wiki.fextralife.com/file/Dark-Souls-2/smelter_sword_weapon_dark_souls_2_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 11.0,
    attributeScaling: ["C", "C", "-", "-", "-"],
    attributesRequired: [20, 16, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A greatsword forged in a demon's flame.\nA fine weapon for those who can wield its weight.",
  });

  console.log("Smelter Sword upserted!");

  await upsertItem({
    id: "fume-ultra-greatsword",
    title: "Fume Ultra Greatsword",
    gameTitle: "Dark Souls 2",
    imgUrl: "https://darksouls2.wiki.fextralife.com/file/Dark-Souls-2/fume_ultra_greatsword_weapon_dark_souls_2_wiki_guide_200px.png",
    type: "Ultra Greatsword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 18.0,
    attributeScaling: ["B", "-", "-", "-", "-"],
    attributesRequired: [40, 0, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "An immense sword carried by a fallen knight.\nCrushing power for those with the strength to raise it.",
  });

  console.log("Fume Ultra Greatsword upserted!");

  await upsertItem({
    id: "heide-knight-sword",
    title: "Heide Knight Sword",
    gameTitle: "Dark Souls 2",
    imgUrl: "https://darksouls2.wiki.fextralife.com/file/Dark-Souls-2/heide_knight_sword_weapon_dark_souls_2_wiki_guide_200px.png",
    type: "Straight Sword",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 5.0,
    attributeScaling: ["C", "C", "-", "-", "-"],
    attributesRequired: [14, 12, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A straight sword borne by the knights of Heide.\nReliable and balanced.",
  });

  console.log("Heide Knight Sword upserted!");

  await upsertItem({
    id: "drangleic-sword",
    title: "Drangleic Sword",
    gameTitle: "Dark Souls 2",
    imgUrl: "https://darksouls2.wiki.fextralife.com/file/Dark-Souls-2/drangleic_sword_weapon_dark_souls_2_wiki_guide_200px.png",
    type: "Straight Sword",
    rating: 3,
    weaponArt: null,
    fpCost: null,
    weight: 3.5,
    attributeScaling: ["D", "D", "-", "-", "-"],
    attributesRequired: [10, 10, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A well-forged blade of the kingdom of Drangleic.\nA dependable choice for any wanderer.",
  });

  console.log("Drangleic Sword upserted!");

  await upsertItem({
    id: "black-knight-sword",
    title: "Black Knight Sword",
    gameTitle: "Dark Souls 1",
    imgUrl: "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword_weapon_dark_souls_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 12.0,
    attributeScaling: ["C", "-", "-", "-", "-"],
    attributesRequired: [18, 0, 0, 0, 0],
    passiveEffects: ["Bonus damage against monsters", "-", "-"],
    description:
      "A sword of black steel, carried by the knights of the abyss.\nA heavy blade with a fine cutting edge.",
  });

  console.log("Black Knight Sword upserted!");

  await upsertItem({
    id: "moonlight-butterfly-horn",
    title: "Moonlight Butterfly Horn",
    gameTitle: "Dark Souls 1",
    imgUrl: "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_butterfly_horn_weapon_dark_souls_wiki_guide_200px.png",
    type: "Magic Weapon",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 1.0,
    attributeScaling: ["-", "-", "B", "-", "-"],
    attributesRequired: [0, 0, 12, 0, 0],
    passiveEffects: ["Magic Damage", "-", "-"],
    description:
      "A horn shed by a moonlit moth.\nIt casts magic arcs of pure light.",
  });

  console.log("Moonlight Butterfly Horn upserted!");

  await upsertItem({
    id: "dragon-greatsword",
    title: "Dragon Greatsword",
    gameTitle: "Dark Souls 1",
    imgUrl: "https://darksouls.wiki.fextralife.com/file/Dark-Souls/dragon_greatsword_weapon_dark_souls_wiki_guide_200px.png",
    type: "Ultra Greatsword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 20.0,
    attributeScaling: ["D", "-", "-", "-", "-"],
    attributesRequired: [40, 0, 0, 0, 0],
    passiveEffects: ["Bonus damage against dragons", "-", "-"],
    description:
      "A weapon carved from a dragon's ancient tooth.\nIts raw force can fell even the greatest beasts.",
  });

  console.log("Dragon Greatsword upserted!");

  await upsertItem({
    id: "zweihander",
    title: "Zweihander",
    gameTitle: "Dark Souls 1",
    imgUrl: "https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander_weapon_dark_souls_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 10.0,
    attributeScaling: ["B", "D", "-", "-", "-"],
    attributesRequired: [24, 10, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A massive two-handed sword.\nStaggers foes with a wide, heavy swing.",
  });

  console.log("Zweihander upserted!");

  await upsertItem({
    id: "silver-knight-straight-sword",
    title: "Silver Knight Straight Sword",
    gameTitle: "Dark Souls 1",
    imgUrl: "https://darksouls.wiki.fextralife.com/file/Dark-Souls/silver_knight_straight_sword_weapon_dark_souls_wiki_guide_200px.png",
    type: "Straight Sword",
    rating: 3,
    weaponArt: null,
    fpCost: null,
    weight: 3.0,
    attributeScaling: ["D", "D", "-", "-", "-"],
    attributesRequired: [10, 10, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A straight sword carried by the knights of Anor Londo.\nSimple, sturdy and well-made.",
  });

  console.log("Silver Knight Straight Sword upserted!");

  await upsertItem({
    id: "blueblood-sword",
    title: "Blueblood Sword",
    gameTitle: "Demon Souls",
    imgUrl: "https://demonssouls.wiki.fextralife.com/file/Demons-Souls/blueblood_sword_weapon_demons_souls_wiki_guide_200px.png",
    type: "Straight Sword",
    rating: 4,
    weaponArt: null,
    fpCost: null,
    weight: 6.0,
    attributeScaling: ["C", "C", "-", "-", "-"],
    attributesRequired: [16, 12, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A sword bearing a noble house's crest.\nEasy to wield and rewarding for skilled hands.",
  });

  console.log("Blueblood Sword upserted!");

  await upsertItem({
    id: "meat-cleaver",
    title: "Meat Cleaver",
    gameTitle: "Demon Souls",
    imgUrl: "https://demonssouls.wiki.fextralife.com/file/Demons-Souls/meat_cleaver_weapon_demons_souls_wiki_guide_200px.png",
    type: "Axe",
    rating: 3,
    weaponArt: null,
    fpCost: null,
    weight: 8.0,
    attributeScaling: ["B", "-", "-", "-", "-"],
    attributesRequired: [18, 0, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A butcher's blade used for far crueler work.\nDeals hefty damage to the unwary.",
  });

  console.log("Meat Cleaver upserted!");

  await upsertItem({
    id: "crescent-falchion",
    title: "Crescent Falchion",
    gameTitle: "Demon Souls",
    imgUrl: "https://demonssouls.wiki.fextralife.com/file/Demons-Souls/crescent_falchion_weapon_demons_souls_wiki_guide_200px.png",
    type: "Curved Sword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 5.0,
    attributeScaling: ["E", "B", "-", "-", "-"],
    attributesRequired: [12, 18, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A curved blade that glows with a faint, pale light.\nIts strikes are swift and unforgiving.",
  });

  console.log("Crescent Falchion upserted!");

  await upsertItem({
    id: "dragon-bone-smasher",
    title: "Dragon Bone Smasher",
    gameTitle: "Demon Souls",
    imgUrl: "https://demonssouls.wiki.fextralife.com/file/Demons-Souls/dragon_bone_smasher_weapon_demons_souls_wiki_guide_200px.png",
    type: "Ultra Greatsword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 20.0,
    attributeScaling: ["B", "-", "-", "-", "-"],
    attributesRequired: [40, 0, 0, 0, 0],
    passiveEffects: ["-", "-", "-"],
    description:
      "A weapon of jagged dragon bone.\nUnrivaled in raw smashing power.",
  });

  console.log("Dragon Bone Smasher upserted!");

  await upsertItem({
    id: "storm-ruler",
    title: "Storm Ruler",
    gameTitle: "Demon Souls",
    imgUrl: "https://demonssouls.wiki.fextralife.com/file/Demons-Souls/storm_ruler_weapon_demons_souls_wiki_guide_200px.png",
    type: "Greatsword",
    rating: 5,
    weaponArt: null,
    fpCost: null,
    weight: 10.0,
    attributeScaling: ["-", "-", "-", "-", "-"],
    attributesRequired: [0, 0, 0, 0, 0],
    passiveEffects: ["Needed to unseal the King of Storms", "-", "-"],
    description:
      "A legendary blade said to command the very storm.\nIts power is bound to a single purpose.",
  });

  console.log("Storm Ruler upserted!");

  console.log("Card Seed Complete");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
});