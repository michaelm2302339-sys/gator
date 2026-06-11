import type { CommandRegistry } from "./commander.js";
import {
  registerCommand,
  runCommand,
  middlewareLoggedInd,
} from "./commander.js";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerGetUsers,
  handlerAddFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
} from "./handlers.js";
import { handlerAgg } from "./agg.js";

const commandRegister: CommandRegistry = {};
registerCommand(commandRegister, "login", handlerLogin);
registerCommand(commandRegister, "register", handlerRegister);
registerCommand(commandRegister, "reset", handlerReset);
registerCommand(commandRegister, "users", handlerGetUsers);
registerCommand(commandRegister, "agg", handlerAgg);
registerCommand(
  commandRegister,
  "addfeed",
  middlewareLoggedInd(handlerAddFeed),
);
registerCommand(commandRegister, "feeds", handlerFeeds);
registerCommand(commandRegister, "follow", middlewareLoggedInd(handlerFollow));
registerCommand(
  commandRegister,
  "following",
  middlewareLoggedInd(handlerFollowing),
);
registerCommand(
  commandRegister,
  "unfollow",
  middlewareLoggedInd(handlerUnfollow),
);

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("ERROR: gator requires atleast 1 positional argument");
    process.exit(1);
  }
  const [commandName, ...arr] = args;
  try {
    await runCommand(commandRegister, commandName, ...arr);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("unknown error", error);
    }
    process.exit(1);
  }

  process.exit(0);
}

await main();
