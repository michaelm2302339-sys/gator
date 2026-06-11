import { setUser, readConfig } from "./config.js";
import {
  createUser,
  getUserByName,
  getUsers,
  dangerouslyDeleteAllUser,
} from "./db/queries/users.js";
import {
  createFeed,
  getAllFeedAndPoster,
  createFeedFollow,
  getFeedByURL,
  getFeedFollowsForUser,
  deleteFeedFollow,
} from "./db/queries/feeds.js";

import type { FeedSelect, UserSelect } from "./db/schema.js";
import { fetchFeed } from "./rss.js";

async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length != 1) {
    throw new Error(
      `${cmdName} handler expects a single arg but got ${args.length}`,
    );
  }

  const [username] = args;
  const userFromDB = await getUserByName(username);
  if (!userFromDB) {
    throw new Error(
      `${username} is not registered. RUN the register command to add`,
    );
  }
  setUser(userFromDB.name);
  console.log(`Welcome Back, ${userFromDB.name}!`);
}

async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length != 1) {
    throw new Error(
      `${cmdName} handler expects a single arg but got ${args.length}`,
    );
  }

  const [regUserName] = args;
  try {
    const user = await createUser(regUserName);
    setUser(user.name);
    console.log(`Welcome To Gator, ${user.name} 🎉`);
    console.table(user);
  } catch (error: any) {
    if (error.cause.code === "23505") {
      throw new Error("Username already exists");
    }

    throw error;
  }
}

async function handlerGetUsers(_: string) {
  const users = await getUsers();
  const loggedInUserName = readConfig().currentUserName;

  users.forEach((user) => {
    const name = user.name;
    if (name === loggedInUserName) {
      console.log(`* ${name} (current)`);
    } else {
      console.log(`* ${name}`);
    }
  });
}

async function handlerReset(_: string) {
  await dangerouslyDeleteAllUser();
  console.log("☠️  You've successfully reseted the database ☠️");
}

async function handlerAgg(_: string) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed, null, 2));
}

async function handlerAddFeed(
  cmdName: string,
  user: UserSelect,
  ...args: string[]
) {
  const feed = await createFeed({
    userId: user.id,
    name: args[0],
    url: args[1],
  });
  const feedFollows = await createFeedFollow({
    userId: user.id,
    feedId: feed.id,
  });

  printFeed(feed, user);
}

function printFeed(feed: FeedSelect, user: UserSelect) {
  console.table(user);
  console.table(feed);
}

async function handlerFeeds(_: string) {
  const results = await getAllFeedAndPoster();
  results.forEach((result) => console.table(result));
}

async function handlerFollow(
  cmdName: string,
  user: UserSelect,
  ...args: string[]
) {
  if (args.length != 1) {
    throw new Error(
      `${cmdName} handler expects a single arg but got ${args.length}`,
    );
  }

  const { id: feedId } = await getFeedByURL(args[0]);
  if (!feedId) {
    throw new Error(
      "No feed found for that url. RUN addfeed <url> to create the feed",
    );
  }
  const { id: userId } = user;
  const results = await createFeedFollow({ userId, feedId });
  console.table(results);
}

async function handlerFollowing(_: string, user: UserSelect) {
  const { id, name } = user;
  const results = await getFeedFollowsForUser(id);
  printFollowing(
    name,
    results.map((result) => ({
      name: result.feeds.name,
      url: result.feeds.url,
    })),
  );
}

function printFollowing(
  userName: string,
  feedDetail: { name: string; url: string }[],
) {
  console.log(`— ${userName} 🙃`);
  console.table(feedDetail);
}

async function handlerUnfollow(
  cmdName: string,
  user: UserSelect,
  ...args: string[]
) {
  if (args.length != 1) {
    throw new Error(
      `${cmdName} handler expects a single arg but got ${args.length}`,
    );
  }
  const feed = await getFeedByURL(args[0]);
  if (!feed) {
    throw new Error("No feed with that url");
  }

  const deletedFeedFollow = await deleteFeedFollow(user.id, feed.id);
  console.log("🗑️ 🗑️");
  console.table(deletedFeedFollow);
}

export {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerGetUsers,
  handlerAgg,
  handlerAddFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
};
