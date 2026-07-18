import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { ItemCard } from '../app/components/item/page';

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
