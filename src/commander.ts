import { readConfig } from "./config";
import { UserSelect } from "./db/schema";
import { getUserByName } from "./db/queries/users";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
type CommandRegistry = Record<string, CommandHandler>;
type UserCommandHandler = (
  cmdName: string,
  user: UserSelect,
  ...args: string[]
) => Promise<void>;

function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  await handler(cmdName, ...args);
}

function middlewareLoggedInd(handler: UserCommandHandler): CommandHandler {
  return async function (cmdName: string, ...args) {
    const userName = readConfig().currentUserName;
    const userFromDB = await getUserByName(userName);
    if (!userFromDB) {
      throw new Error(`User ${userName} not found`);
    }

    await handler(cmdName, userFromDB, ...args);
  };
}

export type { CommandHandler, CommandRegistry, UserCommandHandler };
export { registerCommand, runCommand, middlewareLoggedInd };
