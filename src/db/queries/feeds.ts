import { db } from "..";
import { feeds, type Feed } from "../schema";

async function createFeed(feed: Feed) {
  const [result] = await db.insert(feeds).values(feed).returning();
  return result;
}

export { createFeed };
