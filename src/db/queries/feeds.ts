import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users, feedFollows } from "../schema";
import type { Feed, FeedFollow } from "../schema";

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

async function createFeedFollow(follow: FeedFollow) {
  const _ = await db.insert(feedFollows).values(follow).returning();

  const usersFeedsFollows = await db
    .select()
    .from(feedFollows)
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
  feedFollows;

  return usersFeedsFollows.map((userFeedFollow) => ({
    ...userFeedFollow.feeds_follow,
    userName: userFeedFollow.users.name,
    feedName: userFeedFollow.feeds.name,
  }));
}

async function getFeedByURL(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

async function getFeedFollowsForUser(userId: string) {
  const follows = await db
    .select()
    .from(feedFollows)
    .where(eq(feedFollows.userId, userId))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(users.id, feedFollows.userId));

  return follows;
}

async function deleteFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();

  return result;
}

export {
  createFeed,
  getAllFeedAndPoster,
  createFeedFollow,
  getFeedByURL,
  getFeedFollowsForUser,
  deleteFeedFollow,
};
