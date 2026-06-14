import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { ItemCard } from '../app/components/item/page';

export async function getAllItems(): Promise<ItemCard[]> {
    const items = await db.select().from(schema.item)

    return items;
}
