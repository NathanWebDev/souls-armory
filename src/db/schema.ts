import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  char,
  doublePrecision,
  primaryKey,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  description: text("description"),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  impersonatedBy: text("impersonated_by"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const rateLimit = pgTable("rateLimit", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const item = pgTable("item", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  gameTitle: text("gameTitle").notNull(),
  imgUrl: text("imgUrl").notNull(),
  type: text("type").notNull(),
  rating: doublePrecision("rating").notNull(),
  seedRating: doublePrecision("seed_rating"),
  weaponArt: text("weaponArt"),
  fpCost: integer("fpCost").array(),
  weight: doublePrecision("weight").notNull(),
  attributeScaling: char("atrributeScaling").array(),
  attributesRequired: integer("attributesRequired").array(),
  passiveEffects: text("passiveEffects").array(),
  description: text("description").notNull()
})

export const review = pgTable(
  "review",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    itemId: text("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    unique().on(t.itemId, t.userId),
    check("review_rating_range", sql`${t.rating} between 1 and 5`),
  ],
);

export const reviewVote = pgTable(
  "review_vote",
  {
    reviewId: text("review_id")
      .notNull()
      .references(() => review.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    value: integer("value").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.reviewId, t.userId] }),
    check("review_vote_value", sql`${t.value} in (1, -1)`),
  ],
);

export const reviewReport = pgTable(
  "review_report",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    reviewId: text("review_id")
      .notNull()
      .references(() => review.id, { onDelete: "cascade" }),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    details: text("details"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [unique().on(t.reviewId, t.reporterId)],
);

export const schema = { user, session, account, verification, item, review, reviewVote, reviewReport };
