import {
  pgTable,
  timestamp,
  uuid,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

const feedFollows = pgTable(
  "feeds_follow",
  {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [uniqueIndex("user_feed_ids").on(table.userId, table.feedId)],
);

type Feed = typeof feeds.$inferInsert;
type User = typeof users.$inferInsert;
type FeedFollow = typeof feedFollows.$inferInsert;
type FeedSelect = typeof users.$inferSelect;
type UserSelect = typeof users.$inferSelect;
type FeedFollowSelect = typeof feedFollows.$inferSelect;

export type {
  Feed,
  FeedSelect,
  User,
  UserSelect,
  FeedFollow,
  FeedFollowSelect,
};
export { users, feeds, feedFollows };
