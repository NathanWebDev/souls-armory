import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import { db } from './drizzle';
import { review, user } from './schema';

const ITEM_ID = "dark-moon-greatsword";
const day = 24 * 60 * 60 * 1000;

const fakes = [
  { rating: 5, title: "Moonlight in a blade", body: "Carried me through the whole Caria questline." },
  { rating: 4, title: "Great but heavy", body: "Strong scaling, stamina drain is real." },
  { rating: 3, title: "Fine", body: "Fine for the price of 38 Int." },
  { rating: 2, title: "Not for me", body: "Too slow in PvP." },
  { rating: 5, title: "Best caster weapon", body: "The weapon art alone is worth it." },
].map((r, i) => ({ ...r, userId: `seed-reviewer-${i + 1}`, createdAt: new Date(Date.now() + (i + 1) * day) }));

async function seed() {
  await db.insert(user).values(
    fakes.map((f, i) => ({ id: f.userId, name: `Seed Reviewer ${i + 1}`, email: `${f.userId}@example.invalid` })),
  ).onConflictDoNothing();
  await db.insert(review).values(fakes.map((f) => ({ ...f, itemId: ITEM_ID }))).onConflictDoNothing();
  console.log(`Seeded ${fakes.length} reviews on ${ITEM_ID}`);
}

async function unseed() {
  await db.delete(user).where(inArray(user.id, fakes.map((f) => f.userId))); // reviews cascade
  console.log("Removed seeded users and reviews");
}

(process.argv[2] === "--remove" ? unseed() : seed()).catch((e) => { console.error(e); process.exit(1); });
