import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users, type Feed } from "../schema";

async function createFeed(feed: Feed) {
  const [result] = await db.insert(feeds).values(feed).returning();
  return result;
}

async function getAllFeedAndPoster() {
  const result = await db
    .select()
    .from(feeds)
    .innerJoin(users, eq(users.id, feeds.userId));

  return result;
}

export { createFeed, getAllFeedAndPoster };
