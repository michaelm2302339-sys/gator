import { setUser, readConfig } from "./config.js";
import {
  createUser,
  getUserByName,
  getUsers,
  dangerouslyDeleteAllUser,
} from "./db/queries/users.js";

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
    console.log(user);
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

export {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerGetUsers,
  handlerAgg,
};
