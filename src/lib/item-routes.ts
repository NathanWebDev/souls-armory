import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { ItemCard } from '../app/components/item/page';
import { CardProps } from '@/app/item-card/[id]/page';
import { eq } from 'drizzle-orm';

export async function getAllItems(): Promise<ItemCard[]> {
    const items = await db.select({
      id: schema.item.id,
      title: schema.item.title,
      imgUrl: schema.item.imgUrl,
      type: schema.item.type,
      rating: schema.item.rating,
    })
    .from(schema.item);

    return items;
}

export async function getFullCard(id: string): Promise<CardProps> {
    const card = await db.select({
      id: schema.item.id,
      title: schema.item.title,
      gameTitle: schema.item.gameTitle,
      imgUrl: schema.item.imgUrl,
      type: schema.item.type,
      rating: schema.item.rating,
      weaponArt: schema.item.weaponArt,
      fpCost: schema.item.fpCost,
      weight: schema.item.weight,
      attributeScaling: schema.item.attributeScaling,
      attributesRequired: schema.item.attributesRequired,
      passiveEffects: schema.item.passiveEffects,
      description: schema.item.description
    })
    .from(schema.item)
    .where(eq(schema.item.id, id))
    .limit(1);

    return card[0];
}
